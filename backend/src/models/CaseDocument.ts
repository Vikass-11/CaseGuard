import mongoose, { Document, Schema } from 'mongoose';

export interface ICaseDocument extends Document {
  caseId: string;
  organizationId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  fileName: string;
  fileType: string;
  s3Url?: string; // If storing in S3 later
  textContent: string; // The extracted text
  uploadedAt: Date;
}

const caseDocumentSchema = new Schema<ICaseDocument>({
  caseId: { type: String, required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  s3Url: { type: String },
  textContent: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

// Index for faster queries
caseDocumentSchema.index({ caseId: 1, organizationId: 1 });

export default mongoose.model<ICaseDocument>('CaseDocument', caseDocumentSchema);
