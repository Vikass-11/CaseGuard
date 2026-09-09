import mongoose from 'mongoose';
import Prediction, { IPrediction } from '../models/Prediction';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import TimelineEvent from '../models/TimelineEvent';

export class RealMLService {
  static async generatePrediction(caseId: string, organizationId: string): Promise<IPrediction> {
    const PATTERN_SERVICE_URL = process.env.PATTERN_SERVICE_URL || 'http://localhost:5004';
    const RISK_SERVICE_URL = process.env.RISK_SERVICE_URL || 'http://localhost:5005';

    // 1. Load data
    const statement = await CaseStatement.findOne({ caseId });
    const inputs = await CaseInput.findOne({ caseId });
    const timelineEvents = await TimelineEvent.find({ caseId, organizationId }).sort({ eventDate: 1 });

    const anonymizedText = statement?.anonymizedText || '';

    // 2. Call pattern-service
    let patternResult: any = {};
    try {
      const patternResponse = await fetch(`${PATTERN_SERVICE_URL}/api/analyze-patterns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          narrative: anonymizedText,
          timelineEvents: timelineEvents.map(e => ({
            date: e.eventDate,
            description: e.description,
            severity: e.severityLevel
          }))
        })
      });

      if (!patternResponse.ok) {
        throw new Error(`Pattern service failed with status ${patternResponse.status}`);
      }

      const patternData = await patternResponse.json();
      patternResult = patternData.patternResult || {};
    } catch (error) {
      console.error('Error calling pattern-service:', error);
      // We don't crash, we just proceed with empty patterns
    }

    // Process pattern results
    const detectedPatterns: string[] = [];
    const patternEvidence: any = {};
    
    // Pattern names are keys in the result, like "physical", "financial", etc.
    for (const [key, value] of Object.entries(patternResult)) {
      const pVal = value as any;
      if (pVal && pVal.flagged) {
        // Capitalize and format for display
        const displayKey = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        detectedPatterns.push(displayKey);
        patternEvidence[key] = pVal.matchedEvidenceSpan || [];
      }
    }

    // 3. Generate ruleFlags
    const ruleFlags: string[] = [];
    
    if (inputs?.priorComplaints) {
      ruleFlags.push('PRIOR_COMPLAINTS');
    }
    
    if (inputs?.incidentFrequency) {
      const freq = inputs.incidentFrequency.toLowerCase();
      if (freq.includes('daily') || freq.includes('weekly') || freq.includes('escalating')) {
        ruleFlags.push('FREQUENT_OR_ESCALATING_INCIDENTS');
      }
    }

    if (patternResult['threats']?.flagged) ruleFlags.push('THREATS_PRESENT');
    if (patternResult['physical']?.flagged) ruleFlags.push('PHYSICAL_ABUSE_PRESENT');
    if (patternResult['stalking']?.flagged) ruleFlags.push('STALKING_PRESENT');
    if (patternResult['financial']?.flagged) ruleFlags.push('FINANCIAL_ABUSE_PRESENT');

    // 4. Call risk-service
    let severity = 'Moderate';
    let escalationScore = 50;
    let escalationLevel = 'Medium';
    let triggers: string[] = [];
    let requiresHumanReview = false;

    try {
      const riskResponse = await fetch(`${RISK_SERVICE_URL}/api/assess-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleFlags,
          patterns: Object.keys(patternEvidence).map(k => ({ pattern: k, evidence: patternEvidence[k] })),
          researchPassages: []
        })
      });

      if (!riskResponse.ok) {
        throw new Error(`Risk service failed with status ${riskResponse.status}`);
      }

      const riskData = await riskResponse.json();
      
      severity = riskData.severity || 'Moderate';
      escalationScore = riskData.escalation_score || 50;
      escalationLevel = riskData.escalation_level || 'Medium';
      requiresHumanReview = !!riskData.requires_human_review;
      
      if (riskData.trigger_list && Array.isArray(riskData.trigger_list)) {
        triggers = riskData.trigger_list.map((t: any) => t.trigger_description);
      }

    } catch (error) {
      console.error('Error calling risk-service:', error);
      // Fallback behavior on failure is just to use the defaults assigned above.
    }

    // 5. Save the prediction
    const prediction = await Prediction.findOneAndUpdate(
      { caseId },
      { 
        severity, 
        escalationScore, 
        escalationLevel, 
        patterns: detectedPatterns, 
        triggers,
        requiresHumanReview,
        patternEvidence
      },
      { new: true, upsert: true }
    );

    return prediction;
  }
}
