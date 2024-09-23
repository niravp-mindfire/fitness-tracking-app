import mongoose, { Schema, Document } from 'mongoose';

interface IChallenge extends Document {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    participants: mongoose.Types.ObjectId[]; // references to User
    createdAt: Date;
    updatedAt: Date;
}

const ChallengeSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IChallenge>('Challenge', ChallengeSchema);
