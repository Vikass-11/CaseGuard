"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditedCreate = auditedCreate;
const mongoose_1 = __importDefault(require("mongoose"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
async function auditedCreate(Model, data, actor) {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Explicitly add the organizationId from the actor to ensure isolation safety on creation
        const finalData = { ...data, organizationId: actor.organizationId };
        // Create the document
        const createdDocs = await Model.create([finalData], { session });
        const after = createdDocs[0];
        // Create the audit log
        await AuditLog_1.default.create([{
                organizationId: actor.organizationId,
                actorId: actor.id || actor._id,
                collectionName: Model.modelName,
                documentId: after._id,
                action: 'CREATE',
                diff: after.toObject(), // entire object as diff since it is new
            }], { session });
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
