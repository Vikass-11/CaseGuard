import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEvent extends Document {
  caseId: mongoose.Types.ObjectId;
  date: Date;
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  },
  { timestamps: true }
);

export default mongoose.models.TimelineEvent || mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
