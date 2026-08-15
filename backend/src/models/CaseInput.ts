import mongoose, { Schema, Document } from 'mongoose';

export interface ICaseInput extends Document {
  caseId: mongoose.Types.ObjectId;
  relationshipType: string;
  incidentFrequency: string;
  priorComplaints: boolean;
  incidentTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CaseInputSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    relationshipType: { type: String, required: true },
    incidentFrequency: { type: String, required: true },
    priorComplaints: { type: Boolean, default: false },
    incidentTypes: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.CaseInput || mongoose.model<ICaseInput>('CaseInput', CaseInputSchema);
