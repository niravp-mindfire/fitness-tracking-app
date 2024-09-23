import mongoose, { Schema, Document } from 'mongoose';

interface IExercise extends Document {
    name: string;
    type: string;
    description: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
}

const ExerciseSchema: Schema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
