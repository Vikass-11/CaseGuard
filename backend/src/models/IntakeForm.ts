import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface IIntakeForm extends Document {
  organizationId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  relationshipType: string;
  incidentFrequency: string;
  priorComplaints: boolean;
  incidentTypes: string[];
  createdAt: Date;
}

const IntakeFormSchema = new Schema<IIntakeForm>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  relationshipType: String,
  incidentFrequency: String,
  priorComplaints: Boolean,
  incidentTypes: [String],
  createdAt: { type: Date, default: Date.now },
});

IntakeFormSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.IntakeForm || mongoose.model<IIntakeForm>('IntakeForm', IntakeFormSchema);
