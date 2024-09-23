import mongoose, { Schema, Document } from 'mongoose';

interface ISocialInteraction extends Document {
    userId: mongoose.Types.ObjectId; // reference to User
    friendId: mongoose.Types.ObjectId; // reference to another User
    status: string; // e.g., "pending", "accepted", "declined"
    createdAt: Date;
    updatedAt: Date;
}

const SocialInteractionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    friendId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISocialInteraction>('SocialInteraction', SocialInteractionSchema);
