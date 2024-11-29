<?php

namespace App\Http\Controllers;

use App\Models\WorkoutPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WorkoutPlanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = WorkoutPlan::where('user_id', $user->id);

        // Apply search, filters, and pagination
        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
        }

        if ($request->has(['startDate', 'endDate'])) {
            $query->whereBetween('created_at', [$request->startDate, $request->endDate]);
        }

        $workoutPlans = $query
            ->orderBy($request->get('sort', 'created_at'), $request->get('order', 'desc'))
            ->paginate($request->get('limit', 10));

        return response()->json($workoutPlans);
    }

    public function show($id)
    {
        $workoutPlan = WorkoutPlan::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        return response()->json($workoutPlan);
    }

    public function store(Request $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        $workoutPlan = WorkoutPlan::create($data);
        return response()->json($workoutPlan, 201);
    }

    public function update(Request $request, $id)
    {
        $workoutPlan = WorkoutPlan::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $workoutPlan->update($request->validated());
        return response()->json($workoutPlan);
    }

    public function destroy($id)
    {
        $workoutPlan = WorkoutPlan::where('id', $id)->where('user_id', Auth::id())->firstOrFail();
        $workoutPlan->delete();
        return response()->json(['message' => 'Workout plan deleted']);
    }
}
