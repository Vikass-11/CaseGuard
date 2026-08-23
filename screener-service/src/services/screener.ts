import { RULE_CATEGORIES, NEGATION_WORDS } from '../rules/ruleset';

export interface ScreenResult {
  human_review_required: boolean;
  triggered_rules: string[];
  matched_text_spans: string[];
}

export function screenNarrative(text: string): ScreenResult {
  const result: ScreenResult = {
    human_review_required: false,
    triggered_rules: [],
    matched_text_spans: []
  };

  // Convert text to lowercase tokens for negation checking
  const tokens = text.toLowerCase().split(/[\s,.-]+/);

  for (const [category, patterns] of Object.entries(RULE_CATEGORIES)) {
    for (const pattern of patterns) {
      const matches = text.match(new RegExp(pattern, 'gi'));
      if (matches) {
        for (const match of matches) {
          // Check for negation near the match (look up to 5 words behind)
          if (!isNegated(match, text, tokens)) {
            if (!result.triggered_rules.includes(category)) {
              result.triggered_rules.push(category);
            }
            result.matched_text_spans.push(match);
            result.human_review_required = true;
          }
        }
      }
    }
  }

  return result;
}

function isNegated(matchStr: string, fullText: string, tokens: string[]): boolean {
  const matchIndex = fullText.toLowerCase().indexOf(matchStr.toLowerCase());
  if (matchIndex === -1) return false;

  // Get the text before the match
  const textBefore = fullText.substring(0, matchIndex).toLowerCase();
  const precedingTokens = textBefore.split(/[\s,.-]+/).filter(t => t.length > 0);

  // Check the last 4 tokens before the match for any negation words
  const window = precedingTokens.slice(-4);
  return window.some(token => NEGATION_WORDS.includes(token));
}
