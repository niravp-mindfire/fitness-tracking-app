import mongoose, { Schema, Document } from 'mongoose';

interface IMealPlan extends Document {
    userId: mongoose.Types.ObjectId; // reference to User
    title: string;
    description: string;
    meals: {
        mealType: string; // e.g., "breakfast", "lunch", "dinner"
        foodItems: {
            foodId: mongoose.Types.ObjectId; // reference to FoodItem
            quantity: number; // in grams
        }[];
    }[];
    duration: number; // in days
    createdAt: Date;
    updatedAt: Date;
}

const MealPlanSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    meals: [{
        mealType: { type: String, required: true },
        foodItems: [{
            foodId: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
            quantity: { type: Number, required: true },
        }],
    }],
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);
