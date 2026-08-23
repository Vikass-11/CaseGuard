import { screenNarrative } from '../services/screener';

describe('Deterministic Safety Screener - Adversarial Test Set', () => {
  
  describe('Strangulation/Choking', () => {
    it('should flag direct hits', () => {
      const res = screenNarrative('He strangled me in the kitchen.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('STRANGULATION');
    });

    it('should flag indirect phrasing', () => {
      const res = screenNarrative('He put his hands around my neck and I passed out.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('STRANGULATION');
    });

    it('should flag euphemisms', () => {
      const res = screenNarrative('He squeezed my neck so hard I saw stars.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('STRANGULATION');
    });

    it('should flag respiratory restriction', () => {
      const res = screenNarrative('I was terrified because I couldn\'t breathe when he did it.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('STRANGULATION');
    });
  });

  describe('Weapons', () => {
    it('should flag direct hits', () => {
      const res = screenNarrative('He brought a gun into the house.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('WEAPON');
    });

    it('should NOT flag negations (False Positive Trap)', () => {
      const res = screenNarrative('He didn\'t have a gun this time.');
      expect(res.human_review_required).toBe(false);
      expect(res.triggered_rules).not.toContain('WEAPON');
    });

    it('should flag verbs implying weapons', () => {
      const res = screenNarrative('He threatened to stab me.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('WEAPON');
    });
  });

  describe('Threats to Kill', () => {
    it('should flag explicit threats', () => {
      const res = screenNarrative('He said I will kill you if you leave.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('THREAT_TO_KILL');
    });
  });

  describe('Separation', () => {
    it('should flag separation attempts', () => {
      const res = screenNarrative('I am planning on moving out tomorrow.');
      expect(res.human_review_required).toBe(true);
      expect(res.triggered_rules).toContain('SEPARATION');
    });
  });

});
