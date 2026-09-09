import { Request, Response } from 'express';
import { RiskSchema, RiskAssessment } from '../schemas/RiskSchema';
import { getRiskAssessmentPrompt } from '../prompts/riskPrompt';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

export const assessRisk = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ruleFlags = [], patterns = [], researchPassages = [] } = req.body;

    const useMock = process.env.USE_MOCK_LLM === 'true';

    let validatedData: RiskAssessment;

    if (useMock) {
      let severity: "Moderate" | "Severe" | "Life-Threatening" = "Moderate";
      let escalation_score = 40;
      let escalation_level: "Low" | "Medium" | "High" | "Critical" = "Medium";
      
      // Simple mock logic for testing
      if (ruleFlags.length > 0) {
        severity = "Severe"; 
        escalation_score = 85;
        escalation_level = "High";
        
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

      validatedData = RiskSchema.parse(mockLLMResponse);
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: 'OPENAI_API_KEY is required when USE_MOCK_LLM is false' });
        return;
      }

      const openai = new OpenAI({ apiKey });

      const prompt = getRiskAssessmentPrompt(ruleFlags, patterns, researchPassages);
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert AI risk assessment agent.' },
          { role: 'user', content: prompt }
        ],
        response_format: zodResponseFormat(RiskSchema, 'risk_assessment')
      });
      
      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No content returned from OpenAI');
      }
      
      validatedData = RiskSchema.parse(JSON.parse(responseContent));
    }

    // 1. Consistency Check Layer (already parsed above)

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
