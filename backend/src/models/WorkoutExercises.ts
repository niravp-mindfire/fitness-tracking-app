import mongoose, { Schema, Document } from 'mongoose';

interface IWorkoutExercise extends Document {
    workoutId: mongoose.Types.ObjectId; // reference to Workout
    exerciseId: mongoose.Types.ObjectId; // reference to Exercise
    sets: number;
    reps: number;
    weight: number; // in kg
}

const WorkoutExerciseSchema: Schema = new Schema({
    workoutId: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
    exerciseId: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
});

export default mongoose.model<IWorkoutExercise>('WorkoutExercise', WorkoutExerciseSchema);
