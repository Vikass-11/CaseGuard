"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditedDelete = auditedDelete;
const mongoose_1 = __importDefault(require("mongoose"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
async function auditedDelete(Model, filter, actor) {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const safeFilter = { ...filter, organizationId: actor.organizationId };
        const before = await Model.findOne(safeFilter).session(session).lean();
        if (!before) {
            throw new Error('Document not found or unauthorized');
        }
        await Model.findOneAndDelete(safeFilter, { session });
        await AuditLog_1.default.create([{
                organizationId: actor.organizationId,
                actorId: actor.id || actor._id,
                collectionName: Model.modelName,
                documentId: before._id,
                action: 'DELETE',
                diff: { _deleted: before }, // The entire previous state
            }], { session });
        await session.commitTransaction();
        return true;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}
