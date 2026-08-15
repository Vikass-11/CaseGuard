import mongoose, { Document, Schema } from 'mongoose';

export interface IPatternLabel extends Document {
  caseId: mongoose.Types.ObjectId;
  labels: string[]; // e.g., 'physical', 'financial', 'coercive control'
  coerciveControlFlag: boolean;
  createdAt: Date;
}

const PatternLabelSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true, unique: true },
    labels: [{ type: String }],
    coerciveControlFlag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PatternLabel = mongoose.model<IPatternLabel>('PatternLabel', PatternLabelSchema);
