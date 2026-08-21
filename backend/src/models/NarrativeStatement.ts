import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface INarrativeStatement extends Document {
  organizationId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const NarrativeStatementSchema = new Schema<INarrativeStatement>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

NarrativeStatementSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.NarrativeStatement || mongoose.model<INarrativeStatement>('NarrativeStatement', NarrativeStatementSchema);
