import mongoose from 'mongoose';
import Prediction, { IPrediction } from '../models/Prediction';
import Brief, { IBrief } from '../models/Brief';
import Recommendation, { IRecommendation } from '../models/Recommendation';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import TimelineEvent from '../models/TimelineEvent';

export class MockMLService {
  static async generatePrediction(caseId: string): Promise<IPrediction> {
    // Generate mock prediction data
    const severityOptions = ['Moderate', 'Severe', 'Life-Threatening'];
    const severity = severityOptions[Math.floor(Math.random() * severityOptions.length)] as any;
    const escalationScore = Math.floor(Math.random() * 100);
    const escalationLevel = escalationScore > 75 ? 'High' : escalationScore > 40 ? 'Medium' : 'Low';
    
    const patterns = ['Coercive Control', 'Isolation', 'Threats'];
    const triggers = ['Repeated Complaints', 'Fear Indicators'];

    // Upsert Prediction
    const prediction = await Prediction.findOneAndUpdate(
      { caseId },
      { severity, escalationScore, escalationLevel, patterns, triggers },
      { new: true, upsert: true }
    );

    return prediction;
  }

  static async generateBrief(caseId: string): Promise<IBrief> {
    const inputs = await CaseInput.findOne({ caseId });
    const statement = await CaseStatement.findOne({ caseId });

    const summary = 'This case involves a domestic violence incident...';
    const chronology = '1. Incident reported. 2. Statement recorded.';
    const abuseIndicators = 'Physical abuse, Emotional abuse.';
    const riskLevel = 'High';
    const missingInfo = 'Medical records, Witness statements.';
    const content = `## Summary\n${summary}\n\n## Chronology\n${chronology}\n\n## Abuse Indicators\n${abuseIndicators}\n\n## Risk Level\n${riskLevel}\n\n## Missing Information\n${missingInfo}`;

    const brief = await Brief.findOneAndUpdate(
      { caseId },
      { summary, chronology, abuseIndicators, riskLevel, missingInfo, content },
      { new: true, upsert: true }
    );

    return brief;
  }

  static async generateRecommendations(caseId: string, severity: string): Promise<IRecommendation> {
    const urgency = severity === 'Life-Threatening' ? 'Immediate Action Required' : 'Standard Follow-up';
    const evidenceChecklist = ['Photos of injuries', 'Medical reports', 'Police reports'];
    const followUpQuestions = ['Are there children in the home?', 'Do you have a safe place to stay?'];
    const referrals = ['Local Women Shelter', 'Legal Aid Society'];

    const recommendation = await Recommendation.findOneAndUpdate(
      { caseId },
      { urgency, evidenceChecklist, followUpQuestions, referrals },
      { new: true, upsert: true }
    );

    return recommendation;
  }
}
