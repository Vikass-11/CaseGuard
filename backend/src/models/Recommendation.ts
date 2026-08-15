import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  caseId: mongoose.Types.ObjectId;
  urgency: string;
  evidenceChecklist: string[];
  followUpQuestions: string[];
  referrals: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    urgency: { type: String, required: true },
    evidenceChecklist: [{ type: String }],
    followUpQuestions: [{ type: String }],
    referrals: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
