const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  severity: { type: String, enum: ['low', 'medium', 'high', null] },
  riskScore: { type: Number, default: null },
  abusePatterns: [{ type: String }],
  generatedBrief: { type: String },
  structuredBrief: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { _id: false });

const caseSchema = new mongoose.Schema({
  complainantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String },
  victimName: { type: String, required: true },
  age: { type: Number, required: true },
  abuseType: { type: String, required: true },
  incidentDescription: { type: String, required: true },
  frequency: { type: String, required: true },
  threatLevel: { type: String, required: true }, // Initial from form
  aiThreatLevel: { type: String }, // Calculated by AI
  statement: { type: String, default: "" },
  descriptionRaw: { type: String },
  descriptionAnonymized: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'URGENT', 'IN_REVIEW', 'RESOLVED', 'CLOSED'], 
    default: 'PENDING' 
  },
  riskScore: { type: Number, default: 0, min: 0, max: 100 },
  abuseCategories: [{ type: String }],
  analysis: { type: analysisSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', caseSchema);