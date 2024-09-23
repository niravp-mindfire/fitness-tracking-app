import mongoose, { Schema, Document } from 'mongoose';

interface IMacronutrients {
    carbohydrates: number;
    proteins: number;
    fats: number;
}

interface IFoodItem extends Document {
    name: string;
    calories: number; // per 100g
    macronutrients: IMacronutrients;
    createdAt: Date;
    updatedAt: Date;
}

const FoodItemSchema: Schema = new Schema({
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    macronutrients: {
        carbohydrates: { type: Number, required: true },
        proteins: { type: Number, required: true },
        fats: { type: Number, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);
