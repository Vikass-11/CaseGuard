export const getRiskAssessmentPrompt = (
  ruleFlags: string[],
  patterns: any[],
  researchPassages: string[]
): string => {
  return `
You are an expert AI risk assessment agent analyzing a domestic violence case.
Your goal is to determine the severity and escalation level of the case.

Inputs provided:
1. Rule Flags (Hard determinist triggers): ${JSON.stringify(ruleFlags)}
2. Extracted Patterns (with evidence): ${JSON.stringify(patterns)}
3. Clinical Research Passages (to ground scoring): ${JSON.stringify(researchPassages)}

Instructions:
1. You must output a JSON object exactly matching the required schema.
2. The "severity" field must be one of: "Moderate", "Severe", "Life-Threatening".
3. The "escalation_score" must be an integer from 0 to 100.
4. The "escalation_level" must be one of: "Low", "Medium", "High", "Critical".
5. The "trigger_list" array must explicitly cite why the case received its severity. Every trigger MUST cite a "rule_flag", "research_passage", or "pattern_evidence" in its "source_type", and the "source_reference" must contain the exact string snippet or name of the rule.
6. Important Consistency Check: If there are any "Rule Flags" present (such as strangulation, weapon threat, explicit threats to kill), the severity CANNOT be Moderate.

Output JSON ONLY. Do not output markdown code blocks or any other text.
  `;
};
