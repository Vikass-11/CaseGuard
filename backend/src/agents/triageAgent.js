const Case = require('../models/Case');
const AuditLog = require('../models/AuditLog');
const { classifyThreat } = require('../services/classifierService');

class TriageAgent {
  constructor() {
    this.name = 'TriageAgent';
    this.threshold = 80; // Risk score above 80 triggers URGENT
  }

  async evaluateCase(caseId) {
    try {
      const caseRecord = await Case.findById(caseId);
      if (!caseRecord) {
        throw new Error(`Case ${caseId} not found.`);
      }

      // Re-run classification or use existing score
      // Here we assume the agent actively re-evaluates or analyzes the raw text
      const classification = await classifyThreat(caseRecord.descriptionRaw);

      let escalated = false;
      
      if (classification.riskScore > this.threshold || classification.threatLevel === 'HIGH') {
        caseRecord.status = 'URGENT';
        caseRecord.riskScore = classification.riskScore;
        caseRecord.threatLevel = classification.threatLevel;
        caseRecord.abuseCategories = classification.categories;
        await caseRecord.save();
        escalated = true;

        // Log the autonomous action
        await AuditLog.create({
          action: 'AUTO_ESCALATE_TO_URGENT',
          performedBy: null, // Autonomous Agent
          targetId: caseRecord._id,
          targetModel: 'Case',
          details: { 
            reason: `Risk score (${classification.riskScore}) exceeded threshold (${this.threshold}) or Threat Level is HIGH.`,
            agent: this.name
          }
        });
        
        // In a real system, trigger SMS/Email notifications to Advocates here
        console.log(`[TriageAgent] Case ${caseId} escalated to URGENT.`);
      }

      return { escalated, riskScore: classification.riskScore, threatLevel: classification.threatLevel };
    } catch (error) {
      console.error('[TriageAgent] Error evaluating case:', error);
      throw error;
    }
  }
}

module.exports = new TriageAgent();
