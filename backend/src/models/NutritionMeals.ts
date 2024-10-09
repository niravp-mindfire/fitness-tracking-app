import mongoose, { Schema, Document } from 'mongoose';

interface INutritionMeal extends Document {
    nutritionId: mongoose.Types.ObjectId; // reference to Nutrition
    mealType: string; // e.g., "breakfast", "lunch", "dinner"
    foodItems: {
        foodId: mongoose.Types.ObjectId; // reference to FoodItem
        quantity: number; // in grams
    }[];
    totalCalories: number;
    createdAt: Date; // timestamp for when the meal was created
    updatedAt: Date; // timestamp for when the meal was last updated
}

const NutritionMealSchema: Schema = new Schema({
    nutritionId: { type: Schema.Types.ObjectId, ref: 'Nutrition', required: true },
    mealType: { type: String, required: true },
    foodItems: [{
        foodId: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
        quantity: { type: Number, required: true },
    }],
    totalCalories: { type: Number, required: true },
}, {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
});

export default mongoose.model<INutritionMeal>('NutritionMeal', NutritionMealSchema);
