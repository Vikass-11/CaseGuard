import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  caseId: mongoose.Types.ObjectId;
  severity: 'Moderate' | 'Severe' | 'Life-Threatening';
  escalationScore: number; // 0-100
  escalationLevel: 'Low' | 'Medium' | 'High';
  patterns: string[];
  triggers: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PredictionSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    severity: { type: String, enum: ['Moderate', 'Severe', 'Life-Threatening'], required: true },
    escalationScore: { type: Number, required: true, min: 0, max: 100 },
    escalationLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    patterns: [{ type: String }],
    triggers: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema);
