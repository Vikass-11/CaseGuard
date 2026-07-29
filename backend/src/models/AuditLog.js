const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // e.g., 'CASE_CREATED', 'EVIDENCE_UPLOADED', 'STATUS_CHANGED'
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: false }, // Could be Case ID, Evidence ID, etc.
  targetModel: { type: String, required: false }, // 'Case', 'Evidence', 'User'
  details: { type: mongoose.Schema.Types.Mixed }, // Arbitrary JSON for extra data
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
