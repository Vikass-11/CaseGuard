"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantIsolationPlugin = void 0;
const tenantIsolationPlugin = (schema) => {
    const requireOrgId = function (next) {
        const filter = this.getFilter();
        if (!filter || !filter.organizationId) {
            return next(new Error('organizationId is required in the query filter for tenant isolation.'));
        }
        // Proceed normally if organizationId is present
        next();
    };
    // Typecasting the hook events because Mongoose types can be strict about hook names
    schema.pre('find', requireOrgId);
    schema.pre('findOne', requireOrgId);
    schema.pre('countDocuments', requireOrgId);
    // Update Hooks
    schema.pre('updateMany', requireOrgId);
    schema.pre('updateOne', requireOrgId);
    schema.pre('findOneAndUpdate', requireOrgId);
    // Delete Hooks
    schema.pre('deleteOne', requireOrgId);
    schema.pre('deleteMany', requireOrgId);
    schema.pre('findOneAndDelete', requireOrgId);
};
exports.tenantIsolationPlugin = tenantIsolationPlugin;
