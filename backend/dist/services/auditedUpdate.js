"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditedUpdate = auditedUpdate;
const mongoose_1 = __importDefault(require("mongoose"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
// Helper to calculate simple field-by-field diff
function computeDiff(before, after) {
    const diff = {};
    // Find changed or added fields
    for (const key in after) {
        if (key === '__v' || key === 'updatedAt')
            continue;
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            diff[key] = {
                before: before[key],
                after: after[key]
            };
        }
    }
    // Find removed fields
    for (const key in before) {
        if (key === '__v' || key === 'updatedAt')
            continue;
        if (after[key] === undefined && before[key] !== undefined) {
            diff[key] = {
                before: before[key],
                after: null
            };
        }
    }
    return diff;
}
async function auditedUpdate(Model, filter, update, actor) {
    const session = await mongoose_1.default.startSession();
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
            await AuditLog_1.default.create([{
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
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}
