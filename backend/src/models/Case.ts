import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface ICase extends Document {
  organizationId: mongoose.Types.ObjectId;
  title: string;
  status: 'INTAKE' | 'ANALYSIS' | 'REVIEW' | 'CLOSED';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CaseSchema = new Schema<ICase>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  title: { type: String, required: true },
  status: { type: String, enum: ['INTAKE', 'ANALYSIS', 'REVIEW', 'CLOSED'], default: 'INTAKE' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

CaseSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);
