import mongoose from 'mongoose';
import Prediction, { IPrediction } from '../models/Prediction';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import TimelineEvent from '../models/TimelineEvent';
import Recommendation, { IRecommendation } from '../models/Recommendation';
import Brief, { IBrief } from '../models/Brief';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
export class RealMLService {
  static async generatePrediction(caseId: string, organizationId: string): Promise<IPrediction> {
    const PATTERN_SERVICE_URL = process.env.PATTERN_SERVICE_URL || 'http://localhost:5004';
    const RISK_SERVICE_URL = process.env.RISK_SERVICE_URL || 'http://localhost:5005';
    const SCREENER_SERVICE_URL = process.env.SCREENER_SERVICE_URL || 'http://localhost:5003';
    const KNOWLEDGE_SERVICE_URL = process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:5002';

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

    // 3. Call screener-service to generate ruleFlags
    let ruleFlags: string[] = [];
    let screenerRequiresHumanReview = false;

    try {
      const screenerResponse = await fetch(`${SCREENER_SERVICE_URL}/screen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ narrative: anonymizedText })
      });

      if (screenerResponse.ok) {
        const screenerData = await screenerResponse.json();
        ruleFlags = screenerData.triggered_rules || [];
        screenerRequiresHumanReview = !!screenerData.human_review_required;
      } else {
        console.error(`Screener service failed with status ${screenerResponse.status}`);
      }
    } catch (error) {
      console.error('Error calling screener-service:', error);
    }

    // Add UI fallback rules just in case
    if (inputs?.priorComplaints && !ruleFlags.includes('PRIOR_COMPLAINTS')) ruleFlags.push('PRIOR_COMPLAINTS');
    if (patternResult['threats']?.flagged && !ruleFlags.includes('THREATS_PRESENT')) ruleFlags.push('THREATS_PRESENT');

    // 3.5 Retrieve Research Passages
    let researchPassages: string[] = [];
    try {
      const researchQuery = detectedPatterns.length > 0 ? detectedPatterns.join(' ') : 'domestic violence risk factors';
      const researchResponse = await fetch(`${KNOWLEDGE_SERVICE_URL}/api/retrieve-research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: researchQuery, k: 3 })
      });
      if (researchResponse.ok) {
        const researchData = await researchResponse.json();
        researchPassages = researchData.map((r: any) => r.chunkText);
      }
    } catch (err) {
      console.error('Error fetching research:', err);
    }

    // 4. Call risk-service
    let severity = 'Moderate';
    let escalationScore = 50;
    let escalationLevel = 'Medium';
    let triggers: string[] = [];
    let requiresHumanReview = false;
    let detailedAnalysis = '';

    try {
      const riskResponse = await fetch(`${RISK_SERVICE_URL}/api/assess-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleFlags,
          patterns: Object.keys(patternEvidence).map(k => ({ pattern: k, evidence: patternEvidence[k] })),
          researchPassages
        })
      });

      if (!riskResponse.ok) {
        throw new Error(`Risk service failed with status ${riskResponse.status}`);
      }

      const riskData = await riskResponse.json();

      severity = riskData.severity || 'Moderate';
      escalationScore = riskData.escalation_score || 50;
      escalationLevel = riskData.escalation_level || 'Medium';
      requiresHumanReview = !!riskData.requires_human_review || screenerRequiresHumanReview;
      detailedAnalysis = riskData.detailed_analysis || '';

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
        patternEvidence,
        detailedAnalysis
      },
      { new: true, upsert: true }
    );

    return prediction;
  }

  static async generateRecommendations(caseId: string, severity: string): Promise<IRecommendation> {
    const KNOWLEDGE_SERVICE_URL = process.env.KNOWLEDGE_SERVICE_URL || 'http://localhost:5002';
    const statement = await CaseStatement.findOne({ caseId });
    const narrative = statement?.anonymizedText || '';

    if (!narrative) {
      return await Recommendation.findOneAndUpdate(
        { caseId },
        { 
          urgency: severity === 'Life-Threatening' ? 'Immediate Action Required' : 'Standard Follow-up',
          evidenceChecklist: ['Photos of injuries', 'Medical reports', 'Police reports'],
          followUpQuestions: ['Are there children in the home?', 'Do you have a safe place to stay?'],
          referrals: ['Local Women Shelter', 'Legal Aid Society']
        },
        { new: true, upsert: true }
      );
    }

    // Retrieve legal/referral context
    let legalContext = '';
    try {
      const legalResponse = await fetch(`${KNOWLEDGE_SERVICE_URL}/api/retrieve-legal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: narrative, k: 3, jurisdiction: 'default' })
      });
      if (legalResponse.ok) {
        const legalData = await legalResponse.json();
        legalContext = legalData.map((l: any) => l.chunkText).join('\n\n');
      }
    } catch (err) {
      console.error('Error fetching legal context:', err);
    }

    const prompt = `
You are an expert legal AI assistant analyzing a case narrative for a domestic abuse or legal issue.
Based on the following narrative, generate detailed recommendations for the lawyer handling this case.

Narrative:
"""
${narrative}
"""

Severity of case is: ${severity}.

Here is some retrieved legal and referral context to ground your recommendations:
"""
${legalContext || 'No specific context retrieved.'}
"""

Provide your analysis strictly in JSON format containing the following fields:
{
  "urgency": "A short string indicating urgency (e.g. 'Immediate Action Required', 'Standard Follow-up')",
  "evidenceChecklist": ["Array of strings", "List 3-5 specific pieces of evidence to gather based on the narrative"],
  "followUpQuestions": ["Array of strings", "List 3-5 specific questions the lawyer must ask to fill missing information"],
  "referrals": ["Array of strings", "List 2-4 recommended referrals (e.g. specific types of shelters, counseling, legal aid)"]
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content || '{}';
      const data = JSON.parse(content);

      return await Recommendation.findOneAndUpdate(
        { caseId },
        {
          urgency: data.urgency || 'Standard Follow-up',
          evidenceChecklist: data.evidenceChecklist || [],
          followUpQuestions: data.followUpQuestions || [],
          referrals: data.referrals || []
        },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      return await Recommendation.findOneAndUpdate(
        { caseId },
        { 
          urgency: 'Standard Follow-up',
          evidenceChecklist: ['Photos of injuries', 'Medical reports', 'Police reports'],
          followUpQuestions: ['Are there children in the home?', 'Do you have a safe place to stay?'],
          referrals: ['Local Women Shelter', 'Legal Aid Society']
        },
        { new: true, upsert: true }
      );
    }
  }

  static async generateBrief(caseId: string): Promise<IBrief> {
    const inputs = await CaseInput.findOne({ caseId });
    const statement = await CaseStatement.findOne({ caseId });
    const prediction = await Prediction.findOne({ caseId });

    const narrative = statement?.anonymizedText || 'No detailed statement provided.';

    const prompt = `
You are an expert legal assistant generating a case brief for a domestic violence case.
Based on the following case narrative, generate a detailed legal brief.

Narrative:
"""
${narrative}
"""

Provide your output strictly in JSON format containing the following fields:
{
  "summary": "A 2-3 sentence overview of the facts of the case",
  "chronology": "A bulleted list of key events in chronological order",
  "abuseIndicators": "A comma-separated list of identified abuse patterns (e.g. physical, emotional, financial)",
  "riskLevel": "A short string indicating the risk level (e.g. High, Medium, Low)",
  "missingInfo": "A bulleted list of information or evidence that is missing from the file"
}
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' }
      });

      const jsonStr = response.choices[0]?.message?.content || '{}';
      const data = JSON.parse(jsonStr);

      const summary = data.summary || 'Summary unavailable.';
      const chronology = data.chronology || 'Chronology unavailable.';
      const abuseIndicators = data.abuseIndicators || 'None identified.';
      const riskLevel = data.riskLevel || prediction?.severity || 'Unknown';
      const missingInfo = data.missingInfo || 'No missing information identified.';

      const content = `## Summary
${summary}

## Chronology
${chronology}

## Abuse Indicators
${abuseIndicators}

## Risk Level
${riskLevel}

## Missing Information
${missingInfo}`;

      return await Brief.findOneAndUpdate(
        { caseId },
        { summary, chronology, abuseIndicators, riskLevel, missingInfo, content },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error('Error generating AI brief:', error);
      // Fallback
      const summary = 'This case involves a domestic violence incident...';
      const chronology = '1. Incident reported. 2. Statement recorded.';
      const abuseIndicators = 'Physical abuse, Emotional abuse.';
      const riskLevel = prediction?.severity || 'High';
      const missingInfo = 'Medical records, Witness statements.';
      const content = `## Summary
${summary}

## Chronology
${chronology}

## Abuse Indicators
${abuseIndicators}

## Risk Level
${riskLevel}

## Missing Information
${missingInfo}`;

      return await Brief.findOneAndUpdate(
        { caseId },
        { summary, chronology, abuseIndicators, riskLevel, missingInfo, content },
        { new: true, upsert: true }
      );
    }
  }
}
