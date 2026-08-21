import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface ITimelineEvent extends Document {
  organizationId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  eventDate: Date;
  description: string;
  severityLevel: string;
  createdAt: Date;
}

const TimelineEventSchema = new Schema<ITimelineEvent>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  eventDate: { type: Date, required: true },
  description: { type: String, required: true },
  severityLevel: { type: String },
  createdAt: { type: Date, default: Date.now },
});

TimelineEventSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.TimelineEvent || mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
