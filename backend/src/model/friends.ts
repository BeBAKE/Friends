import mongoose, { Document, Schema } from 'mongoose';

export interface IFriendRequest extends Document {
  from: mongoose.Types.ObjectId
  to: mongoose.Types.ObjectId
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

const FriendRequestSchema = new Schema<IFriendRequest>({
  from: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema)