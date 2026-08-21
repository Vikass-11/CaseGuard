import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog';

// Helper to calculate simple field-by-field diff
function computeDiff(before: any, after: any) {
  const diff: any = {};
  
  // Find changed or added fields
  for (const key in after) {
    if (key === '__v' || key === 'updatedAt') continue;
    
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      diff[key] = {
        before: before[key],
        after: after[key]
      };
    }
  }

  // Find removed fields
  for (const key in before) {
    if (key === '__v' || key === 'updatedAt') continue;
    
    if (after[key] === undefined && before[key] !== undefined) {
      diff[key] = {
        before: before[key],
        after: null
      };
    }
  }

  return diff;
}

export async function auditedUpdate(Model: any, filter: any, update: any, actor: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Mongoose tenant isolation plugin expects organizationId in filter
    const safeFilter = { ...filter, organizationId: actor.organizationId };

    const before = await Model.findOne(safeFilter).session(session).lean();
    if (!before) {
      throw new Error('Document not found or unauthorized');
    }

    const after = await Model.findOneAndUpdate(safeFilter, update, { new: true, session }).lean();
    
    const diff = computeDiff(before, after);

    // Only log if something actually changed
    if (Object.keys(diff).length > 0) {
      await AuditLog.create([{
        organizationId: actor.organizationId,
        actorId: actor.id || actor._id,
        collectionName: Model.modelName,
        documentId: after._id,
        action: 'UPDATE',
        diff,
      }], { session });
    }

    await session.commitTransaction();
    return after;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
