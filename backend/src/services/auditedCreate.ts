import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog';

export async function auditedCreate(Model: any, data: any, actor: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Explicitly add the organizationId from the actor to ensure isolation safety on creation
    const finalData = { ...data, organizationId: actor.organizationId };
    
    // Create the document
    const createdDocs = await Model.create([finalData], { session });
    const after = createdDocs[0];

    // Create the audit log
    await AuditLog.create([{
      organizationId: actor.organizationId,
      actorId: actor.id || actor._id,
      collectionName: Model.modelName,
      documentId: after._id,
      action: 'CREATE',
      diff: after.toObject(), // entire object as diff since it is new
    }], { session });

    await session.commitTransaction();
    return after;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
