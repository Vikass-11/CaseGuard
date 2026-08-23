export const RULE_CATEGORIES = {
  STRANGULATION: [
    /strangl(e|ed|ing)/i,
    /chok(e|ed|ing)/i,
    /hands around (my|her|his) neck/i,
    /squeez(e|ed|ing) (my|her|his) neck/i,
    /couldn'?t breathe/i,
    /cut off (my|her|his) air/i,
    /suffocat(e|ed|ing)/i
  ],
  WEAPON: [
    /\bgun(s)?\b/i,
    /\bpistol(s)?\b/i,
    /\bknif(e|ves)\b/i,
    /\bshoot(ing)?\b/i,
    /\bshot(gun)?\b/i,
    /\bstab(bed|bing)?\b/i,
    /\bweapon(s)?\b/i
  ],
  THREAT_TO_KILL: [
    /kill(ed|ing)? (you|me|her|him)/i,
    /end (your|my) life/i,
    /you'?re dead/i,
    /put (you|me) in the ground/i
  ],
  SEPARATION: [
    /leav(e|ing) (him|her|me)/i,
    /left (him|her|me)/i,
    /divorce/i,
    /mov(e|ing) out/i,
    /break(ing)? up/i
  ]
};

// Words that indicate a negation
export const NEGATION_WORDS = ['no', 'not', 'didnt', "didn't", 'doesnt', "doesn't", 'wasnt', "wasn't", 'never', 'without'];
