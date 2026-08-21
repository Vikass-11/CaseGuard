import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface IAuditLog extends Document {
  organizationId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  collectionName: string;
  documentId: mongoose.Types.ObjectId;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  diff?: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collectionName: { type: String, required: true },
  documentId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
  diff: { type: Schema.Types.Mixed }, // { field: { before, after } } pairs
  timestamp: { type: Date, default: Date.now },
});

AuditLogSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
