# Module 7 Implementation Plan: Risk Assessment Agent

This module builds the AI agent responsible for assessing the severity and escalation of a domestic violence case, grounded entirely in deterministic rule flags (Module 5), extracted patterns (Module 6), and clinical research passages (Module 3). We enforce a strict JSON schema for outputs and implement specific consistency checks to ensure the LLM's scoring aligns with critical flags.

## Architecture

- **Service**: `risk-service` running on port 5005.
- **Framework**: Express.js with TypeScript.
- **Testing**: Jest and Supertest.

## Features Implemented

1. **Zod Schemas (`RiskSchema.ts`)**: Enforces strict JSON output containing `severity`, `escalation_score`, `escalation_level`, `trigger_list`, and `requires_human_review`.
2. **Prompts (`riskPrompt.ts`)**: Instructs the LLM to ground its outputs in the provided flags and citations.
3. **Endpoint (`RiskController.ts`)**: Provides `/api/assess-risk` endpoint that includes a consistency check layer. If the input contains hard rule flags but the severity is evaluated as `Moderate`, it flips the `requires_human_review` flag to `true` to force a human review, per the master prompt's safety guidelines.
4. **Testing (`evalSet.test.ts`)**: Automates the testing of the consistency check layer.

## Future Work
- Replace Mock LLM response with real LangChain integration (OpenAI/Anthropic/Bedrock).
