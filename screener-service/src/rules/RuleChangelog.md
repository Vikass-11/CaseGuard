# Rule Changelog (Safety Screener)

## [1.0.0] - 2026-08-23
### Added
- **Strangulation/Choking:** Initial regex matching direct and indirect phrasing ("choked", "strangled", "hands around my neck", "squeezed my neck", "couldn't breathe").
- **Weapons:** Keyword matching for guns, knives, and shooting/stabbing verbs.
- **Threats to Kill:** Direct phrases ("kill you", "end your life", "you're dead").
- **Separation:** Indicators of recent or attempted separation ("left him", "divorce", "moving out").
- **Negation Handling:** Basic proximity-based negation check to prevent false flags (e.g., "didn't have a gun").
