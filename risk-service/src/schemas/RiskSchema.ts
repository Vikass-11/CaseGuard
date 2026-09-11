import { z } from 'zod';

export const TriggerSourceTypeEnum = z.enum(['rule_flag', 'research_passage', 'pattern_evidence']);
export const SeverityEnum = z.enum(['Moderate', 'Severe', 'Life-Threatening']);
export const EscalationLevelEnum = z.enum(['Low', 'Medium', 'High', 'Critical']);

export const TriggerItemSchema = z.object({
  trigger_description: z.string(),
  source_type: TriggerSourceTypeEnum,
  source_reference: z.string()
});

export const RiskSchema = z.object({
  severity: SeverityEnum,
  escalation_score: z.number().min(0).max(100),
  escalation_level: EscalationLevelEnum,
  trigger_list: z.array(TriggerItemSchema),
  requires_human_review: z.boolean().default(false),
  detailed_analysis: z.string()
});

export type RiskAssessment = z.infer<typeof RiskSchema>;
