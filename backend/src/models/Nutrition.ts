import mongoose, { Schema, Document } from 'mongoose';

interface INutrition extends Document {
    userId: mongoose.Types.ObjectId; // reference to User
    date: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const NutritionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<INutrition>('Nutrition', NutritionSchema);
