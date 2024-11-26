<?php

namespace App\Http\Controllers;

use App\Models\Workout;
use App\Http\Requests\CreateWorkoutRequest;
use App\Http\Requests\UpdateWorkoutRequest;
use App\Http\Requests\GetAllWorkoutsRequest;
use App\Http\Requests\DeleteWorkoutRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkoutController extends Controller
{
    // Get all workouts
    public function index(GetAllWorkoutsRequest $request)
    {
        $user = Auth::user(); // Get the authenticated user
        $query = Workout::where('user_id', $user->id);

        // Apply filters from the validated request
        if ($request->startDate) {
            $query->where('date', '>=', $request->startDate);
        }
        if ($request->endDate) {
            $query->where('date', '<=', $request->endDate);
        }

        if ($request->sort) {
            $query->orderBy($request->sort, $request->order ?: 'asc');
        }

        $workouts = $query->paginate($request->limit ?: 10);
        return response()->json([
            'total' => $workouts->total(),
            'page' => $workouts->currentPage(),
            'limit' => $workouts->perPage(),
            'totalPages' => $workouts->lastPage(),
            'workouts' => $workouts->items(),
        ]);
    }

    // Show a single workout
    public function show($id)
    {
        $user = Auth::user(); // Get the authenticated user

        // Find the workout that belongs to the authenticated user
        $workout = Workout::where('user_id', $user->id)->findOrFail($id);

        return response()->json($workout);
    }

    // Create a new workout
    public function store(CreateWorkoutRequest $request)
    {
        $user = Auth::user(); // Get the authenticated user

        $workout = Workout::create([
            'user_id' => $user->id,
            'date' => $request->date,
            'duration' => $request->duration,
            'notes' => $request->notes,
        ]);

        return response()->json($workout, 201);
    }

    // Update an existing workout
    public function update(UpdateWorkoutRequest $request, $id)
    {
        $user = Auth::user(); // Get the authenticated user
        $workout = Workout::where('user_id', $user->id)->findOrFail($id);

        $workout->update($request->validated());

        return response()->json($workout);
    }

    // Delete a workout
    public function destroy(DeleteWorkoutRequest $request, $id)
    {
        $user = Auth::user(); // Get the authenticated user
        $workout = Workout::where('user_id', $user->id)->findOrFail($id);
        
        $workout->delete();

        return response()->json(['message' => 'Workout deleted successfully']);
    }
}
