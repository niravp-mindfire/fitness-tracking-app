import mongoose, { Schema, Document } from 'mongoose';

interface IWorkoutPlan extends Document {
    userId: mongoose.Types.ObjectId; // reference to User
    title: string;
    description: string;
    exercises: {
        exerciseId: mongoose.Types.ObjectId; // reference to Exercise
        sets: number;
        reps: number;
    }[];
    duration: number; // in weeks
    createdAt: Date;
    updatedAt: Date;
}

const WorkoutPlanSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    exercises: [{
        exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
        sets: { type: Number, required: true },
        reps: { type: Number, required: true },
    }],
    duration: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);
