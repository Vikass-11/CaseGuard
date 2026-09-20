import mongoose, { Document, Schema } from 'mongoose';

export interface ICaseChunk extends Document {
  caseId: string;
  sourceDocId: string;
  chunkText: string;
  embedding: number[];
  createdAt: Date;
}

const CaseChunkSchema = new Schema<ICaseChunk>({
  caseId: { type: String, required: true },
  sourceDocId: { type: String, required: true },
  chunkText: { type: String, required: true },
  embedding: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CaseChunk || mongoose.model<ICaseChunk>('CaseChunk', CaseChunkSchema);
