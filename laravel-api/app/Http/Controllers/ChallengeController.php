<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChallengeController extends Controller
{
    public function index(Request $request)
    {
        $challenges = Challenge::query();

        if ($request->filled('search')) {
            $challenges->where('title', 'like', '%' . $request->search . '%')
                ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('start_date')) {
            $challenges->where('start_date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $challenges->where('end_date', '<=', $request->end_date);
        }

        $challenges = $challenges->paginate($request->get('limit', 10));
        return response()->json($challenges);
    }

    public function show($id)
    {
        $challenge = Challenge::find($id);
        if (!$challenge) {
            return response()->json(['error' => 'Challenge not found'], 404);
        }

        return response()->json($challenge);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'participants' => 'required|array',
            'participants.*' => 'integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $challenge = Challenge::create($request->all());
        return response()->json($challenge, 201);
    }

    public function update(Request $request, $id)
    {
        $challenge = Challenge::find($id);
        if (!$challenge) {
            return response()->json(['error' => 'Challenge not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date',
            'participants' => 'sometimes|required|array',
            'participants.*' => 'integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $challenge->update($request->all());
        return response()->json($challenge);
    }

    public function destroy($id)
    {
        $challenge = Challenge::find($id);
        if (!$challenge) {
            return response()->json(['error' => 'Challenge not found'], 404);
        }

        $challenge->delete();
        return response()->json(['message' => 'Challenge deleted successfully']);
    }
}
