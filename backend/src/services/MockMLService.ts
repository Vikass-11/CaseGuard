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

  static async generateBrief(caseId: string, organizationId?: string, userId?: string): Promise<IBrief> {
    const inputs = await CaseInput.findOne({ caseId });
    const statement = await CaseStatement.findOne({ caseId });

    const summary = 'This case involves an escalating pattern of domestic violence and coercive control requiring urgent protective judicial relief.';
    const chronology = '1. Reported domestic incident with escalating verbal and physical threats.\n2. Sworn intake statement recorded detailing fear of imminent harm.\n3. Clinical lethality markers verified.';
    const abuseIndicators = 'Physical Battery, Coercive Control, Threats to Harm, Intimidation.';
    const riskLevel = 'High';
    const missingInfo = '1. Certified 911 dispatch audio transcript.\n2. Emergency room medical admission charts.\n3. Third-party neighbor witness affidavits.';
    const researchCitations = [
      'Campbell, J. C. (2003). Assessing Risk in Domestic Violence: The Danger Assessment Instrument.',
      'Strangulation Lethality Studies (DV Lethality Assessment Benchmark § 11.4).'
    ];
    const content = `# PRIVILEGED LEGAL MEMORANDUM & CASE BRIEF
IN SUPPORT OF PETITION FOR EX-PARTE TEMPORARY RESTRAINING ORDER

## I. EXECUTIVE SUMMARY
${summary}

## II. FACTUAL CHRONOLOGY OF INCIDENTS
${chronology}

## III. ABUSE TYPOLOGY & CLINICAL LETHALITY MARKERS
${abuseIndicators}

## IV. ASSESSED DANGER ASSESSMENT LEVEL
${riskLevel} - Imminent risk of severe re-injury warranting immediate statutory protective orders.

## V. CLINICAL RESEARCH & BENCHMARKS
${researchCitations.map(c => `• ${c}`).join('\n')}

## VI. EVIDENTIARY GAPS & PRE-TRIAL INVESTIGATION
${missingInfo}

## VII. PRAYER FOR INJUNCTIVE RELIEF
Petitioner respectfully prays that this Court issue an immediate Temporary Restraining Order with 500-yard stay-away, peaceful contact surrender, and firearm relinquishment provisions.`;

    const brief = await Brief.findOneAndUpdate(
      { caseId },
      {
        caseId,
        organizationId: organizationId || undefined,
        generatedBy: userId || undefined,
        lastSavedBy: userId || undefined,
        summary,
        chronology,
        abuseIndicators,
        riskLevel,
        missingInfo,
        researchCitations,
        content
      },
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
