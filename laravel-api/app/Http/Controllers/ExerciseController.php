<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;
use App\Http\Requests\CreateExerciseRequest;
use App\Http\Requests\UpdateExerciseRequest;

class ExerciseController extends Controller
{
    // Get all exercises with search, sort, pagination, and date filtering
    public function index(Request $request)
    {
        $query = Exercise::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->startDate || $request->endDate) {
            $query->whereBetween('created_at', [
                $request->startDate ?? '1970-01-01',
                $request->endDate ?? now(),
            ]);
        }

        $query->orderBy($request->sort ?? 'name', $request->order ?? 'asc');

        $exercises = $query->paginate($request->limit ?? 10);

        return response()->json([
            'total' => $exercises->total(),
            'page' => $exercises->currentPage(),
            'limit' => $exercises->perPage(),
            'totalPages' => $exercises->lastPage(),
            'exercises' => $exercises->items(),
        ]);
    }

    // Get a single exercise by ID
    public function show($id)
    {
        $exercise = Exercise::findOrFail($id);
        return response()->json($exercise);
    }

    // Create a new exercise
    public function store(CreateExerciseRequest $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
        ]);

        $exercise = Exercise::create($request->all());
        return response()->json($exercise, 201);
    }

    // Update an existing exercise
    public function update(UpdateExerciseRequest $request, $id)
    {
        $exercise = Exercise::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string',
            'type' => 'sometimes|string',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string',
        ]);

        $exercise->update($request->all());
        return response()->json($exercise);
    }

    // Delete an exercise
    public function destroy($id)
    {
        $exercise = Exercise::findOrFail($id);
        $exercise->delete();
        return response()->json(['message' => 'Exercise deleted successfully']);
    }
}
