import mongoose, { Schema, Document } from 'mongoose';

interface IWorkout extends Document {
    userId: mongoose.Types.ObjectId; // reference to User
    date: Date;
    duration: number; // in minutes
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const WorkoutSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    notes: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
WorkoutSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IWorkout>('Workout', WorkoutSchema);
