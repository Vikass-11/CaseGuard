import mongoose, { Schema } from 'mongoose';

export const tenantIsolationPlugin = (schema: Schema) => {
  const requireOrgId = function (this: any) {
    const filter = this.getFilter();
    
    // Bypass for unique validator which might not have organizationId
    if (this._mongooseOptions && this._mongooseOptions.isUniqueValidator) {
       return;
    }

    if (!filter || !filter.organizationId) {
      throw new Error('organizationId is required in the query filter for tenant isolation.');
    }
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
