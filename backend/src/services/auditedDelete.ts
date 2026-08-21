import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog';

export async function auditedDelete(Model: any, filter: any, actor: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const safeFilter = { ...filter, organizationId: actor.organizationId };
    
    const before = await Model.findOne(safeFilter).session(session).lean();
    if (!before) {
      throw new Error('Document not found or unauthorized');
    }

    await Model.findOneAndDelete(safeFilter, { session });

    await AuditLog.create([{
      organizationId: actor.organizationId,
      actorId: actor.id || actor._id,
      collectionName: Model.modelName,
      documentId: before._id,
      action: 'DELETE',
      diff: { _deleted: before }, // The entire previous state
    }], { session });

    await session.commitTransaction();
    return true;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
