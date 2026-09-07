import { Request, Response } from 'express';
import { RiskSchema, RiskAssessment } from '../schemas/RiskSchema';
import { getRiskAssessmentPrompt } from '../prompts/riskPrompt';

export const assessRisk = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ruleFlags = [], patterns = [], researchPassages = [] } = req.body;

    // Simulate LLM Call - in production this uses LangChain + LLM
    // We will build a deterministic mock response based on inputs for structural testing
    let severity: "Moderate" | "Severe" | "Life-Threatening" = "Moderate";
    let escalation_score = 40;
    let escalation_level: "Low" | "Medium" | "High" | "Critical" = "Medium";
    
    // Simple mock logic for testing
    if (ruleFlags.length > 0) {
      severity = "Severe"; // This ensures consistency check typically passes in the mock
      escalation_score = 85;
      escalation_level = "High";
      
      // If we specifically want to test the consistency failure, we can look for a keyword
      if (ruleFlags.includes('TEST_CONSISTENCY_FAILURE')) {
        severity = "Moderate";
      }
    }

    const mockLLMResponse: any = {
      severity,
      escalation_score,
      escalation_level,
      trigger_list: ruleFlags.map((flag: string) => ({
        trigger_description: "Hard rule triggered",
        source_type: "rule_flag",
        source_reference: flag
      })),
      requires_human_review: false
    };

    // 1. Validate the structure
    const validatedData = RiskSchema.parse(mockLLMResponse);

    // 2. Consistency Check Layer
    const hasHardFlags = ruleFlags.length > 0 && !ruleFlags.includes('TEST_CONSISTENCY_FAILURE');
    // If we deliberately pass TEST_CONSISTENCY_FAILURE, we pretend there is a hard flag
    const effectivelyHasHardFlags = ruleFlags.length > 0;

    if (effectivelyHasHardFlags && validatedData.severity === "Moderate") {
      validatedData.requires_human_review = true;
      console.warn("CONSISTENCY CHECK FAILED: Rule flags are present but LLM scored severity as Moderate. Forcing human review.");
    }

    res.status(200).json(validatedData);
  } catch (error: any) {
    console.error('Error assessing risk:', error);
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Schema validation failed', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
