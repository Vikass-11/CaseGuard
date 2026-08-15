import mongoose, { Schema, Document } from 'mongoose';

export interface ICase extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  status: 'open' | 'closed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['open', 'closed', 'archived'], 
      default: 'open' 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);
