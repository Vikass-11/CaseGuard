import mongoose, { Document, Schema } from 'mongoose';

export interface IPiiReviewItem extends Document {
  caseId: mongoose.Types.ObjectId;
  spanOffsetStart: number;
  spanOffsetEnd: number;
  encryptedSpanText: string;
  detectedType: string;
  confidence: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PiiReviewItemSchema = new Schema<IPiiReviewItem>({
  caseId: { type: Schema.Types.ObjectId, required: true, index: true },
  spanOffsetStart: { type: Number, required: true },
  spanOffsetEnd: { type: Number, required: true },
  encryptedSpanText: { type: String, required: true },
  detectedType: { type: String, required: true },
  confidence: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'REJECTED'], default: 'PENDING' },
  reviewedBy: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PiiReviewItem || mongoose.model<IPiiReviewItem>('PiiReviewItem', PiiReviewItemSchema);
