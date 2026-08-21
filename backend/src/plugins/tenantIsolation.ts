import mongoose, { Schema } from 'mongoose';

export const tenantIsolationPlugin = (schema: Schema) => {
  const requireOrgId = function (this: any, next: (err?: mongoose.CallbackError) => void) {
    const filter = this.getFilter();
    
    if (!filter || !filter.organizationId) {
      return next(new Error('organizationId is required in the query filter for tenant isolation.'));
    }
    
    // Proceed normally if organizationId is present
    next();
  };

  // Typecasting the hook events because Mongoose types can be strict about hook names
  schema.pre('find' as any, requireOrgId);
  schema.pre('findOne' as any, requireOrgId);
  schema.pre('countDocuments' as any, requireOrgId);

  // Update Hooks
  schema.pre('updateMany' as any, requireOrgId);
  schema.pre('updateOne' as any, requireOrgId);
  schema.pre('findOneAndUpdate' as any, requireOrgId);

  // Delete Hooks
  schema.pre('deleteOne' as any, requireOrgId);
  schema.pre('deleteMany' as any, requireOrgId);
  schema.pre('findOneAndDelete' as any, requireOrgId);
};
