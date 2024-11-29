<?php 
namespace App\Http\Controllers;

use App\Models\WorkoutExercise;
use Illuminate\Http\Request;

class WorkoutExerciseController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkoutExercise::with(['workout', 'exercise']);

        if ($search = $request->input('search')) {
            $query->whereHas('exercise', function ($q) use ($search) {
                $q->where('name', 'like', "%$search%");
            });
        }

        $workoutExercises = $query
            ->orderBy($request->input('sortBy', 'created_at'), $request->input('sortOrder', 'desc'))
            ->paginate($request->input('limit', 10));

        return response()->json($workoutExercises);
    }

    public function show($id)
    {
        $workoutExercise = WorkoutExercise::with(['workout', 'exercise'])->find($id);

        if (!$workoutExercise) {
            return response()->json(['message' => 'Workout Exercise not found'], 404);
        }

        return response()->json($workoutExercise);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'workout_id' => 'required|exists:workouts,id',
            'exercise_id' => 'required|exists:exercises,id',
            'sets' => 'required|integer|min:1',
            'reps' => 'required|integer|min:1',
            'weight' => 'required|numeric|min:0',
        ]);

        $workoutExercise = WorkoutExercise::create($validated);

        return response()->json(['message' => 'Workout Exercise added successfully', 'data' => $workoutExercise], 201);
    }

    public function update(Request $request, $id)
    {
        $workoutExercise = WorkoutExercise::find($id);

        if (!$workoutExercise) {
            return response()->json(['message' => 'Workout Exercise not found'], 404);
        }

        $validated = $request->validate([
            'sets' => 'integer|min:1',
            'reps' => 'integer|min:1',
            'weight' => 'numeric|min:0',
        ]);

        $workoutExercise->update($validated);

        return response()->json(['message' => 'Workout Exercise updated successfully', 'data' => $workoutExercise]);
    }

    public function destroy($id)
    {
        $workoutExercise = WorkoutExercise::find($id);

        if (!$workoutExercise) {
            return response()->json(['message' => 'Workout Exercise not found'], 404);
        }

        $workoutExercise->delete();

        return response()->json(['message' => 'Workout Exercise deleted successfully']);
    }
}
