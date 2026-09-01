import { z } from 'zod';

export const CategoryResultSchema = z.object({
  flagged: z.boolean().describe("Whether this pattern of abuse is present in the narrative."),
  matchedEvidenceSpan: z.array(z.string()).describe("Exact substrings from the narrative that justify this categorization. MUST be exact quotes. Empty if flagged is false.")
});

export const PatternSchema = z.object({
  physical: CategoryResultSchema,
  financial: CategoryResultSchema,
  coercive_control: CategoryResultSchema,
  verbal: CategoryResultSchema,
  intimidation: CategoryResultSchema,
  stalking: CategoryResultSchema,
  isolation: CategoryResultSchema,
  threats: CategoryResultSchema
});

export type PatternResult = z.infer<typeof PatternSchema>;
