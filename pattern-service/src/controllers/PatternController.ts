import { Request, Response } from 'express';
import { PATTERN_PROMPT } from '../prompts/patternPrompt';
import { PatternSchema, PatternResult } from '../schemas/PatternSchema';
// In a real app, this would use LangChain and actual LLM keys (OpenAI/Anthropic)
// For this scaffolding, we use a mock approach if USE_MOCK_LLM is true

export const analyzePatterns = async (req: Request, res: Response) => {
  try {
    const { narrative, timelineEvents } = req.body;

    if (!narrative) {
      return res.status(400).json({ error: 'Narrative is required' });
    }

    const useMock = process.env.USE_MOCK_LLM === 'true';

    let patternResult: PatternResult;

    if (useMock) {
      // Mock result based on keywords
      patternResult = mockAnalyzePatterns(narrative);
    } else {
      // Real LLM call would go here
      // const prompt = PATTERN_PROMPT.replace('{{NARRATIVE}}', narrative).replace('{{TIMELINE}}', JSON.stringify(timelineEvents || []));
      // const llmResponse = await llm.call(prompt);
      // patternResult = PatternSchema.parse(JSON.parse(llmResponse));
      throw new Error('Real LLM integration not fully implemented yet in pattern-service');
    }

    return res.json({
      patternResult
    });
  } catch (error) {
    console.error('Error analyzing patterns:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

function mockAnalyzePatterns(narrative: string): PatternResult {
  const lowerNarrative = narrative.toLowerCase();
  
  const extractSpan = (keywords: string[]) => {
    for (const kw of keywords) {
      const idx = lowerNarrative.indexOf(kw);
      if (idx !== -1) {
        // Return a naive span of ~30 chars around the keyword
        const start = Math.max(0, idx - 15);
        const end = Math.min(narrative.length, idx + kw.length + 15);
        return [narrative.substring(start, end).trim()];
      }
    }
    return [];
  };

  const getResult = (keywords: string[]) => {
    const spans = extractSpan(keywords);
    return {
      flagged: spans.length > 0,
      matchedEvidenceSpan: spans
    };
  };

  return {
    physical: getResult(['hit', 'slap', 'punch', 'strangle', 'grab']),
    financial: getResult(['money', 'allowance', 'bank', 'credit', 'job', 'work']),
    coercive_control: getResult(['control', 'permission', 'monitor', 'phone', 'tracker']),
    verbal: getResult(['yell', 'stupid', 'bitch', 'worthless', 'shout']),
    intimidation: getResult(['smash', 'break', 'throw', 'wall', 'look']),
    stalking: getResult(['follow', 'show up', 'track', 'wait outside']),
    isolation: getResult(['friends', 'family', 'not allowed to see', 'alone']),
    threats: getResult(['kill', 'hurt', 'take the kids', 'ruin'])
  };
}
