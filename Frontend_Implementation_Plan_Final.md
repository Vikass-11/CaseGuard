# Frontend UI Implementation Plan (Final): Next.js + shadcn/ui

**Goal:** Build the complete Next.js frontend to interface with all the backend modules (PII Service, Knowledge Service, Screener, etc.), focusing on trauma-informed design, clear evidence citations, and a highly complex "Case Detail" view.

## Phased Execution Strategy

Executed in phases, with sign-off between each rather than attempting the full scope in one pass:

- **Phase 1 (Foundation):** Next.js scaffold, shadcn/ui, global layouts, authentication screens, trauma-informed design tokens.
- **Phase 2 (Intake & Queues):** Case Intake forms, PII Review Queue.
- **Phase 3 (The Case Detail Engine):** Brief, Timeline, Overrides, Navigator — **plus the agent-processing and contradiction/failure states around them** (see section 5 below). These aren't a Phase 4 add-on; they're part of the same screen and easy to end up bolting on afterward if they're not scoped in from the start.
- **Phase 4 (Admin):** Admin dashboard, monitoring, referral staleness UI.

## Resolved: Authentication / Organization Strategy

**Default: single hardcoded Organization for now, no org-name field on registration.** This is the simpler Phase 1 build, and Module 1's schema already supports multi-org either way — adding an org-name field to the same registration form later is a form change, not a data-model migration. Revisit this if/when there's an actual second organization to onboard.

## Proposed Changes (Phase 1 Focus)

### 1. Project Scaffolding

- Clean up the existing `frontend/` directory (if any) or re-initialize with Next.js (App Router), TypeScript, and Tailwind CSS.
- Install and configure `shadcn/ui` for accessible, unstyled components to theme heavily.

### 2. Design System & Trauma-Informed Tokens

- CSS variables in `globals.css` enforcing a calm, non-alarmist color palette.
- "Life-Threatening" severity uses clear, legible colors (deep burnt orange/muted reds) rather than flashing, siren-style neon reds.
- Build the global `EvidenceCitation` popover component right away, since it's reused across the Brief, pattern chips, and risk scores in Phase 3.

### 3. Core Layouts & Navigation

- **Role-Aware Shell**: topbar/sidebar layout that dynamically shows/hides links (Admin Monitoring, PII Review Queue) based on role (`LAWYER`, `CASE_WORKER`, `ADMIN`).
- Base Login and Registration screens, registration built against the single-org default above.

### 4. Privacy-Conscious Defaults

- All list views (Case List, PII Queue) omit narrative previews, showing only badges and statuses — protects confidentiality in shared workspaces.

## 5. Phase 3 Scope Addition: States Around the Content

Called out explicitly here so it isn't lost by the time Phase 3 starts:

- **Agent-processing state**: while Modules 5–8's pipeline is running on a case, the Case Detail view needs a clear "analysis in progress" state — not a blank screen or a bare spinner with no context.
- **Contradiction/failure states**: distinct from a generic error — a Module 6 schema-validation failure after retries and a Module 9 rule-vs-agent contradiction are both meaningful states a lawyer needs to understand and act on differently, and each needs its own UI treatment rather than sharing one generic "something went wrong" screen.
- These should be designed alongside the Brief/Timeline/Overrides/Navigator sections they interrupt, not added after those sections are already built — the interruption points (where processing is happening, where a contradiction halts the pipeline) are part of the same layout decisions as the content itself.

---

## Verification Plan

### Manual Verification (before moving to Phase 2)

1. Layout dynamically adjusts based on mock user roles.
2. Color palette and typography match the trauma-informed guidelines.
3. `EvidenceCitation` component functions correctly with mock data.
4. Registration flow works end-to-end against the single-org default.

### Manual Verification (before moving out of Phase 3, once reached)

5. Case Detail view correctly shows an "analysis in progress" state when a mock case's pipeline is incomplete.
6. Case Detail view shows a distinct, understandable state for a mock contradiction/failure case, visually different from both the normal completed state and a generic error.
