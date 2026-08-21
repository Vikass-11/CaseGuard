import mongoose, { Document, Schema } from 'mongoose';

export interface IPiiMap extends Document {
  caseId: mongoose.Types.ObjectId;
  token: string;
  encryptedOriginalValue: string;
  entityType: string;
  createdAt: Date;
}

const PiiMapSchema = new Schema<IPiiMap>({
  caseId: { type: Schema.Types.ObjectId, required: true, index: true },
  token: { type: String, required: true },
  encryptedOriginalValue: { type: String, required: true },
  entityType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PiiMap || mongoose.model<IPiiMap>('PiiMap', PiiMapSchema);
