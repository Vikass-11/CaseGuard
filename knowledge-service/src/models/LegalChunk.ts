import mongoose, { Document, Schema } from 'mongoose';

export interface ILegalChunk extends Document {
  sourceDocId: string;
  chunkText: string;
  jurisdiction: string;
  documentType: string;
  embedding: number[];
  lastVerifiedAt: Date;
  createdAt: Date;
}

const LegalChunkSchema = new Schema<ILegalChunk>({
  sourceDocId: { type: String, required: true },
  chunkText: { type: String, required: true },
  jurisdiction: { type: String, required: true, index: true },
  documentType: { type: String, required: true }, // e.g. 'statute', 'shelter_contact'
  embedding: { type: [Number], required: true },
  lastVerifiedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.LegalChunk || mongoose.model<ILegalChunk>('LegalChunk', LegalChunkSchema);
