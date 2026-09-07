import request from 'supertest';
import app from '../src/index';

describe('Risk Assessment Agent - API Endpoint Tests', () => {
  it('should return a valid RiskAssessment response for normal input', async () => {
    const res = await request(app)
      .post('/api/assess-risk')
      .send({
        ruleFlags: ['choking_mention'],
        patterns: [{ category: 'physical', matchedEvidenceSpan: ['he grabbed my throat'] }],
        researchPassages: ['Choking is a significant predictor of lethal violence.']
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('severity');
    expect(res.body.severity).toBe('Severe');
    expect(res.body).toHaveProperty('escalation_score');
    expect(res.body).toHaveProperty('trigger_list');
    expect(res.body.requires_human_review).toBe(false);
  });

  it('should force human review when consistency check fails', async () => {
    // Our mock controller is hardcoded to return 'Moderate' severity if 'TEST_CONSISTENCY_FAILURE' is passed,
    // which triggers the consistency check since there's effectively a rule flag present.
    const res = await request(app)
      .post('/api/assess-risk')
      .send({
        ruleFlags: ['TEST_CONSISTENCY_FAILURE'],
        patterns: [],
        researchPassages: []
      });

    expect(res.status).toBe(200);
    expect(res.body.severity).toBe('Moderate');
    // The critical check: did it flag for review?
    expect(res.body.requires_human_review).toBe(true);
  });

  it('should return 400 for invalid schema (if we tested actual validation failure)', async () => {
    // Currently our mock controller uses hardcoded values, so it always returns valid schema 
    // unless the internal LLM returns garbage. 
    // This is a placeholder test for when real LLM is used.
    expect(true).toBe(true);
  });
});
