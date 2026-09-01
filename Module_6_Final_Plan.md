# Module 6 Implementation Plan: Pattern Detection Agent

This module builds the AI agent responsible for classifying domestic violence abuse into specific categories based on the anonymized case narrative and timeline. We will enforce strict JSON schemas to guarantee evidence citation and use targeted prompts to elevate coercive control as a primary lens.

## User Review Required

> [!IMPORTANT]
> **New Microservice vs. Shared Agent Service**
> We propose creating a new microservice named `pattern-service` (Node.js/TypeScript) specifically for this agent. Alternatively, we could create a more general `agent-service` if we want to combine Pattern Detection (Module 6), Risk Assessment (Module 7), and Brief Generation (Module 8) in one service. For isolation and independent testing, a separate `pattern-service` is recommended.

## Open Questions

> [!WARNING]
> **LLM Provider**
> The `knowledge-service` uses mock AWS Bedrock. For this agent, do we want to use an actual LLM API (OpenAI / Anthropic / AWS Bedrock) via LangChain, or continue with a mock LLM for the initial structural build-out?

## Proposed Changes

### `pattern-service` Project Scaffold
- Scaffold a new Express/TypeScript microservice in the `pattern-service` directory.
- Add `pattern-service` to `docker-compose.yml` mapped to port `5004`.

### 1. LLM Integration & Schema Definition
#### [NEW] `pattern-service/src/schemas/PatternSchema.ts`
- Define the JSON schema (using Zod) for the agent's output.
- Categories include: `physical`, `financial`, `coercive_control`, `verbal`, `intimidation`, `stalking`, `isolation`, `threats`.
- Each category result must include a `boolean` flag and a `matchedEvidenceSpan` array (strings extracted directly from the narrative).

### 2. Prompt Engineering
#### [NEW] `pattern-service/src/prompts/patternPrompt.ts`
- Implement the "golden thread" prompt. Explicitly instruct the model to weight controlling behavior, isolation, and fear language on par with physical incident frequency.
- Instruct the model that it MUST extract exact substring quotes for evidence. If no exact quote is found, the category must not be flagged.

### 3. API Endpoint
#### [NEW] `pattern-service/src/controllers/PatternController.ts`
- `POST /analyze-patterns`
- **Input:** `{ narrative: string, timelineEvents: TimelineEvent[] }` (Note: Must be pre-anonymized data).
- **Output:** The strictly validated JSON matching the `PatternSchema`.

### 4. Evaluation Framework
#### [NEW] `pattern-service/tests/evalSet.ts`
- Build a labeled synthetic evaluation dataset of 10-15 varied cases (some physical-heavy, some coercive-control-only).
- Implement a script to run the agent against this dataset and output precision/recall metrics for each category to validate prompt efficacy.

## Verification Plan

### Automated Tests
- `npm run test` within `pattern-service` to run unit tests on the Zod schema validation and endpoint structure.
- Run the evaluation script (`npm run eval`) using the synthetic dataset to ensure the prompt correctly categorizes non-physical coercive control cases without hallucinating evidence spans.

### Manual Verification
- Start the service via Docker Compose.
- Send a `POST` request with an anonymized narrative containing subtle financial abuse and isolation.
- Verify the response JSON correctly identifies those categories and returns exact quotes in the `matchedEvidenceSpan`.
