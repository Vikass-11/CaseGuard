# Module 2 Implementation Plan (Final): Privacy & Anonymization Pipeline

Goal: a hardened, independently-testable boundary that strips PII from case data before anything reaches an LLM, vector store, or log file. Built as a standalone service — a real network boundary, not a shared library imported into the main app.

## User Review Required

> [!IMPORTANT]
> **Detection Engine Choice**
> Uses **Amazon Comprehend's PII detection API** (`DetectPiiEntities`), called from a Node/Express service via the AWS SDK — keeps the whole system on one language and gives you hands-on AWS practice. Case text is sent to Comprehend to be scanned; Comprehend doesn't store or reuse customer content by default, and this stays inside AWS rather than a public third-party API, but it's a trust boundary worth being deliberate about.

## Open Questions

> [!WARNING]
> **Manual Review Threshold**
> Defaulting to a 0.85 Comprehend confidence cutoff — below that, an entity goes to the review queue instead of being auto-redacted or auto-passed-through. Easy to tune once you see real false-positive/negative rates.

## Proposed Changes

### 1. Service Boundary

- **`pii-service/`**: a separate Express + TypeScript service, its own process/container, reachable only from the main backend — enforced at the docker-compose network level in dev, and via security-group rules once it's on AWS.
- Single endpoint: `POST /anonymize` — takes raw text, returns anonymized text + detected spans (type, confidence, offset range, placeholder token).
- Hard dependency of case intake (Module 1's Case/IntakeForm/NarrativeStatement/TimelineEvent creation flow) — no case-related text is persisted without passing through here first.

### 2. Detection Pipeline

- **Primary pass — Amazon Comprehend `DetectPiiEntities`**: catches names, addresses, phone numbers, emails, and other standard PII types.
- **Chunking with overlap**: Comprehend's sync API caps input at ~100KB, so long narratives are split at paragraph boundaries — but with a **~200-character overlap** between adjacent chunks, and detections falling in an overlapping region are de-duplicated by offset rather than kept twice. Without this overlap, an entity straddling a chunk boundary (a long address, a hyphenated name) can be missed or truncated by both the primary and secondary pass — the overlap closes that blind spot.
- **Secondary pass — deterministic regex layer, run locally**: catches domain-specific identifiers Comprehend won't reliably flag — case/complaint reference numbers, jurisdiction-specific ID formats, and employer/school names (worth calling out specifically — these can de-identify a victim in a small community even without a literal name attached). This list will need iterating as you see real intake data.
- **Entity matching rule (explicit, v1 scope)**: the same placeholder token is reused for the same entity **only when the span text matches exactly** (case-sensitive, exact string). This is a deliberate simplification — there's no coreference resolution in v1, so "John," "John Smith," and "he" will each get separate tokens even if they refer to the same person, and two different people who happen to share an exact name string would be merged under one token. State this plainly in the service's docs/comments so nobody downstream (Module 6+ agents, or you six months from now) assumes the tokens encode more identity-resolution than they do. Pronoun/nickname linking is a reasonable future improvement, not a v1 guarantee.

### 3. Mapping Table & Re-identification

- **`PiiMap` collection** (Mongoose): `caseId`, `token`, `encryptedOriginalValue`, `entityType`, `createdAt`.
- Encrypted at rest — AES-256-GCM via Node's `crypto`, key managed through **AWS KMS** (rotation + access logging built in).
- Re-identification only happens inside the authenticated case-worker UI (Module 9) via an audited "unmask" action (reuse Module 1's audit-logging pattern — viewing unmasked PII is logged like a write).
- Every other part of the system (agents, RAG, logs, AuditLog diffs) only ever sees tokens, never `encryptedOriginalValue` or its decrypted form.

### 4. Low-Confidence Review Queue

- **`PiiReviewItem` collection**: `caseId`, `spanOffsetStart`, `spanOffsetEnd`, `encryptedSpanText`, `detectedType`, `confidence`, `status` (PENDING/CONFIRMED/REJECTED), `reviewedBy`.
- **The flagged span text is encrypted the same way as `PiiMap`** (same KMS-backed key, or a sibling key under the same KMS setup) — not stored as plain `spanText`. This collection exists to hold the *most* ambiguous, often name-shaped content in the whole system; storing it unencrypted would quietly defeat the encryption work done in section 3. The reviewer's UI decrypts on demand for display, same access pattern as `PiiMap` unmasking, and that decrypt-to-view action is audit-logged too.
- The offset range (rather than relying solely on the stored text) lets the reviewer see the span in its surrounding context by re-fetching from the source document if needed, without a second independent copy of the plaintext sitting around.
- Anything below the confidence cutoff is held here — the case can't progress past intake into analysis (Module 6+) until pending items are resolved by a human.

### 5. Testing Strategy

- **Golden test set**: synthetic narratives with known PII in varied forms — direct names, nicknames, indirect references, employer/school mentions, PII in unusual sentence structures.
- **Adversarial cases**: euphemistic/oblique phrasing that might not match Comprehend's training distribution.
- **Chunk-boundary test specifically**: a synthetic narrative long enough to require chunking, with a PII entity deliberately placed across a chunk boundary — assert it's still caught exactly once (not missed, not duplicated).
- **Leakage assertion**: for every golden test case, assert zero known-PII strings appear anywhere in the anonymized output, in `PiiMap`'s non-encrypted fields, or in `PiiReviewItem`'s non-encrypted fields — run in CI on every change to the regex list or the Comprehend integration.
- **Review-queue trigger test**: confirm ambiguous inputs land in `PiiReviewItem` (encrypted) rather than being auto-decided either way.

## Verification Plan

### Automated Tests

- Jest suite running the golden test set through `POST /anonymize`, asserting zero leakage and correct token stability under the exact-match rule (identical spans → identical token; near-identical spans → intentionally separate tokens).
- Test that a case with pending `PiiReviewItem`s cannot progress to `ANALYSIS` status.
- Test that `PiiReviewItem.encryptedSpanText` cannot be read as plaintext without going through the same decrypt path as `PiiMap`.

### Manual Verification

1. Submit a narrative containing a name, address, phone number, and an employer mention through the intake flow.
2. Confirm the stored `NarrativeStatement` contains only placeholder tokens — check the database directly.
3. Confirm both `PiiMap` and `PiiReviewItem` hold only encrypted values at rest, and that decrypting either requires going through KMS.
4. As a lawyer user, trigger "unmask" on a case and on a pending review item, and confirm both are audit-logged.
5. Submit a narrative with a PII entity deliberately spanning a chunk boundary and confirm it's detected exactly once.
