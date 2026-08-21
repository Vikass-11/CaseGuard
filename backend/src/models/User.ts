import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  organizationId: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  passwordHash: string;
  role: 'LAWYER' | 'CASE_WORKER' | 'ADMIN';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['LAWYER', 'CASE_WORKER', 'ADMIN'], default: 'CASE_WORKER' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
