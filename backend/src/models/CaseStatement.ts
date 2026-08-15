import mongoose, { Schema, Document } from 'mongoose';

export interface ICaseStatement extends Document {
  caseId: mongoose.Types.ObjectId;
  anonymizedText: string;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStatementSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    anonymizedText: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CaseStatement || mongoose.model<ICaseStatement>('CaseStatement', CaseStatementSchema);
