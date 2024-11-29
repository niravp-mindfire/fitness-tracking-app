<?php

namespace App\Http\Controllers;

use App\Models\FoodItem;
use Illuminate\Http\Request;

class FoodItemController extends Controller
{
    // Get all food items with optional search, sort, and pagination
    public function index(Request $request)
    {
        $search = $request->query('search');
        $sort = $request->query('sort', 'name');
        $order = $request->query('order', 'asc');
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 10);

        $query = FoodItem::query();

        if ($search) {
            $query->where('name', 'LIKE', "%$search%");
        }

        $query->orderBy($sort, $order);

        if ($page == -1 && $limit == -1) {
            $foodItems = $query->get();
        } else {
            $foodItems = $query->paginate($limit, ['*'], 'page', $page);
        }

        return response()->json($foodItems);
    }

    // Get a single food item by ID
    public function show($id)
    {
        $foodItem = FoodItem::find($id);

        if (!$foodItem) {
            return response()->json(['message' => 'Food item not found'], 404);
        }

        return response()->json($foodItem);
    }

    // Create a new food item
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'calories' => 'required|integer',
            'macronutrients' => 'required|array',
            'macronutrients.carbohydrates' => 'required|numeric',
            'macronutrients.proteins' => 'required|numeric',
            'macronutrients.fats' => 'required|numeric',
        ]);

        $foodItem = FoodItem::create($validated);

        return response()->json($foodItem, 201);
    }

    // Update an existing food item
    public function update(Request $request, $id)
    {
        $foodItem = FoodItem::find($id);

        if (!$foodItem) {
            return response()->json(['message' => 'Food item not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'calories' => 'sometimes|integer',
            'macronutrients' => 'sometimes|array',
            'macronutrients.carbohydrates' => 'sometimes|numeric',
            'macronutrients.proteins' => 'sometimes|numeric',
            'macronutrients.fats' => 'sometimes|numeric',
        ]);

        $foodItem->update($validated);

        return response()->json($foodItem);
    }

    // Delete a food item
    public function destroy($id)
    {
        $foodItem = FoodItem::find($id);

        if (!$foodItem) {
            return response()->json(['message' => 'Food item not found'], 404);
        }

        $foodItem->delete();

        return response()->json(['message' => 'Food item deleted successfully']);
    }
}

