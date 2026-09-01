import { PatternSchema } from '../src/schemas/PatternSchema';
import { analyzePatterns } from '../src/controllers/PatternController';

const syntheticEvalCases = [
  {
    id: "case-01",
    description: "Physical abuse heavy",
    narrative: "He got angry after drinking and hit me across the face, then grabbed my arm so hard it bruised. He told me he'd kill me if I left.",
    expected: {
      physical: true,
      threats: true,
      financial: false,
      coercive_control: false
    }
  },
  {
    id: "case-02",
    description: "Coercive control and isolation, no physical",
    narrative: "He took my phone and installed a tracker on it. I'm not allowed to see my friends anymore, he says they are a bad influence. He gives me a small allowance and checks all the receipts.",
    expected: {
      physical: false,
      coercive_control: true,
      isolation: true,
      financial: true,
      threats: false
    }
  }
];

describe('Pattern Detection Agent Evaluation', () => {
  test('PatternSchema validation works on valid mock response', () => {
    const validData = {
      physical: { flagged: true, matchedEvidenceSpan: ["hit me"] },
      financial: { flagged: false, matchedEvidenceSpan: [] },
      coercive_control: { flagged: false, matchedEvidenceSpan: [] },
      verbal: { flagged: false, matchedEvidenceSpan: [] },
      intimidation: { flagged: false, matchedEvidenceSpan: [] },
      stalking: { flagged: false, matchedEvidenceSpan: [] },
      isolation: { flagged: false, matchedEvidenceSpan: [] },
      threats: { flagged: false, matchedEvidenceSpan: [] }
    };
    
    expect(() => PatternSchema.parse(validData)).not.toThrow();
  });
});
