import mongoose, { Document, Schema } from 'mongoose';

export interface IResearchChunk extends Document {
  sourceDocId: string;
  chunkText: string;
  sectionHeading?: string;
  embedding: number[];
  createdAt: Date;
}

const ResearchChunkSchema = new Schema<IResearchChunk>({
  sourceDocId: { type: String, required: true },
  chunkText: { type: String, required: true },
  sectionHeading: { type: String },
  embedding: { type: [Number], required: true }, // For Atlas Vector Search
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ResearchChunk || mongoose.model<IResearchChunk>('ResearchChunk', ResearchChunkSchema);
