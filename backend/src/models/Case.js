const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  complainantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  descriptionRaw: { type: String, required: true }, // Encrypted raw text for restricted advocate review
  descriptionAnonymized: { type: String, required: true }, // PII redacted text for general display
  status: { 
    type: String, 
    enum: ['PENDING', 'URGENT', 'IN_REVIEW', 'RESOLVED', 'CLOSED'], 
    default: 'PENDING' 
  },
  threatLevel: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    default: 'LOW' 
  },
  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  abuseCategories: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', caseSchema);