import mongoose, { Schema, Document } from 'mongoose';

export interface IBrief extends Document {
  caseId: mongoose.Types.ObjectId;
  summary: string;
  chronology: string;
  abuseIndicators: string;
  riskLevel: string;
  missingInfo: string;
  content: string; // The fully assembled editable brief
  createdAt: Date;
  updatedAt: Date;
}

const BriefSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    summary: { type: String, required: true },
    chronology: { type: String, required: true },
    abuseIndicators: { type: String, required: true },
    riskLevel: { type: String, required: true },
    missingInfo: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Brief || mongoose.model<IBrief>('Brief', BriefSchema);
