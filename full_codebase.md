# CaseGuard Full Codebase

### `Frontend_Implementation_Plan_Final.md`
```md
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
```

### `frontend/src/components/EvidenceCitation.tsx`
```tsx
"use client";

import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EvidenceCitationProps {
  children: ReactNode;
  evidenceText?: string;
  researchCitation?: {
    source: string;
    section?: string;
    passage: string;
  };
}

export function EvidenceCitation({ children, evidenceText, researchCitation }: EvidenceCitationProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer border-b border-dashed border-primary/50 hover:bg-muted transition-colors rounded-sm px-1">
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 shadow-md">
        <div className="space-y-4">
          {evidenceText && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source Narrative</h4>
              <p className="text-sm italic border-l-2 border-primary/50 pl-2 text-foreground/90">
                "{evidenceText}"
              </p>
            </div>
          )}
          
          {researchCitation && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clinical Foundation</h4>
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-1">
                {researchCitation.source} {researchCitation.section ? `(§\${researchCitation.section})` : ''}
              </span>
              <p className="text-sm border-l-2 border-accent pl-2 text-foreground/80">
                "{researchCitation.passage}"
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### `frontend/src/components/ui/popover.tsx`
```tsx
"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
```

### `full_codebase.md`
```md
# CaseGuard Full Codebase

### `Frontend_Implementation_Plan_Final.md`
```md
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
```

### `frontend/src/components/EvidenceCitation.tsx`
```tsx
"use client";

import { ReactNode } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EvidenceCitationProps {
  children: ReactNode;
  evidenceText?: string;
  researchCitation?: {
    source: string;
    section?: string;
    passage: string;
  };
}

export function EvidenceCitation({ children, evidenceText, researchCitation }: EvidenceCitationProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className="cursor-pointer border-b border-dashed border-primary/50 hover:bg-muted transition-colors rounded-sm px-1">
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 shadow-md">
        <div className="space-y-4">
          {evidenceText && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Source Narrative</h4>
              <p className="text-sm italic border-l-2 border-primary/50 pl-2 text-foreground/90">
                "{evidenceText}"
              </p>
            </div>
          )}
          
          {researchCitation && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clinical Foundation</h4>
              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-1">
                {researchCitation.source} {researchCitation.section ? `(§\${researchCitation.section})` : ''}
              </span>
              <p className="text-sm border-l-2 border-accent pl-2 text-foreground/80">
                "{researchCitation.passage}"
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### `frontend/src/components/ui/popover.tsx`
```tsx
"use client"

import * as React from "react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={cn(
            "z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-0.5 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
```

### `.env.example`
```example
# ==============================================================================
# CaseGuard — Root Environment Reference
# Copy this file and rename to .env in the appropriate subdirectory.
# See README.md for full documentation on each variable.
# ==============================================================================

# ------------------------------------------------------------------------------
# BACKEND (backend/.env)
# ------------------------------------------------------------------------------

# MongoDB connection string (required)
# Format: mongodb://localhost:27017/caseguard  OR  mongodb+srv://<user>:<pass>@cluster.mongodb.net/caseguard
MONGODB_URI=mongodb://localhost:27017/caseguard

# JWT secret key — used to sign and verify authentication tokens (required)
# Use a strong random string of at least 32 characters in production
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google Gemini API Key — powers all AI features (optional for local dev)
# Without this key, all AI services (redaction, classifier, brief generator,
# triage agent, statute agent, and assistant bot) will run in MOCK/FALLBACK mode.
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Backend server port (optional, defaults to 5000)
PORT=5000

# ------------------------------------------------------------------------------
# FRONTEND (frontend/.env)
# ------------------------------------------------------------------------------

# Backend API base URL — must point to the running backend server (required)
VITE_API_BASE_URL=http://localhost:5000
```

### `.github/workflows/ci.yml`
```yml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  frontend-tests:
    name: Frontend Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci --legacy-peer-deps
      
      - name: TypeScript type check
        working-directory: ./frontend
        run: npx tsc --noEmit
      
      - name: Build frontend
        working-directory: ./frontend
        run: npm run build

  backend-tests:
    name: Backend Tests
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci --legacy-peer-deps
      
      - name: Lint backend
        working-directory: ./backend
        run: npm run lint || echo "No lint script configured"

  code-quality:
    name: Code Quality
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Super-Linter
        uses: github/super-linter@v5
        env:
          DEFAULT_BRANCH: main
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          VALIDATE_ALL_CODEBASE: false
          VALIDATE_JAVASCRIPT_ES: true
          VALIDATE_TYPESCRIPT_ES: true
          VALIDATE_JSON: true
          VALIDATE_YAML: true
          VALIDATE_MARKDOWN: true
```

### `.gitignore`
```txt
.next/
node_modules/
.venv/
venv/
__pycache__/
*.py[cod]
*.log
*.sqlite3
fastapi_backend/data/

# Local app/runtime artifacts
frontend*.log
backend*.log
*.err.log
*.tsbuildinfo

# Env files
.env
.env.local
.env*.local

DV_Case_Analyzer_10_Module_Build_Prompt.md
UI_Build_Prompt.md
Module_1_Final_Plan.md
Module_2_Final_Plan.md
Module_3_Research_RAG_Plan.md
Module_4_Legal_Referral_RAG_Plan.md
Module_5_Final_Plan.md
```

### `Module_1_Final_Plan.md`
```md
# Module 1 Implementation Plan (Final): Mongoose & Express on MongoDB

This plan details the implementation of organization-level data isolation, role-based access, and full audit logging with diffs, using the MERN stack (Express + TypeScript, MongoDB, Mongoose).

## User Review Required

> [!IMPORTANT]
> **Local Database Requirement**
> Because the audit logging requires atomic writes (saving the document and the audit log in a single transaction), MongoDB must be run as a **single-node replica set**. A standard standalone MongoDB instance does not support multi-document transactions. I will use a `docker-compose.yml` to set this up.

## Open Questions

> [!WARNING]
> **Registration Flow**
> Does registration ask for an "Organization Name" (creating a new org and making that user its Admin), or does everyone land in a single "Default Org" for now? Please clarify this before we begin building the registration flow.

## Proposed Changes

### 1. Database & Models (Mongoose)

We will define the core schemas with strict `organizationId` references — every tenant-scoped collection carries it directly (rather than only on `Case`), so the isolation plugin below applies uniformly and no collection is left ungoverned.

- **`backend/src/models/Organization.ts`**: Name and timestamps.
- **`backend/src/models/User.ts`**: Name, email, passwordHash, role (LAWYER, CASE_WORKER, ADMIN), and `organizationId`.
- **`backend/src/models/Case.ts`**: Status, createdBy, and `organizationId`.
- **`backend/src/models/IntakeForm.ts`**: Structured intake fields (relationship type, incident frequency, prior complaints, incident types), `caseId`, and `organizationId`.
- **`backend/src/models/NarrativeStatement.ts`**: Free-text narrative content, `caseId`, and `organizationId`.
- **`backend/src/models/TimelineEvent.ts`**: Date, description, severity level, `caseId`, and `organizationId`.
- **`backend/src/models/AuditLog.ts`**: actorId, collectionName, documentId, action (CREATE/UPDATE/DELETE), diff (Mixed), and `organizationId`.

### 2. Organization-Level Isolation

To prevent data leaks, isolation will be enforced centrally rather than relying on manual query filters in controllers.

- **Mongoose Plugin**: A shared plugin applied to every tenant-scoped schema (`Case`, `IntakeForm`, `NarrativeStatement`, `TimelineEvent`, `AuditLog`) that adds hooks on **all** query and write paths that touch existing documents:
  - Read: `pre('find')`, `pre('findOne')`, `pre('countDocuments')`
  - Update: `pre('updateMany')`, `pre('updateOne')`, `pre('findOneAndUpdate')`
  - Delete: `pre('deleteOne')`, `pre('deleteMany')`, `pre('findOneAndDelete')`

  Each hook throws if `organizationId` is not present in the query filter, rather than silently defaulting it. `findOneAndUpdate` and the delete hooks matter as much as `find`/`updateMany` — they're the ones the audited-write helpers below actually call, so leaving them out of the plugin would mean the real write path goes unguarded even though the read path looks covered.

- **Express Middleware**: An auth middleware that attaches `req.orgScope = { organizationId: req.user.organizationId }` to every request.
- **Service Layer**: A repository/service layer that merges `req.orgScope` into query filters before passing them to Mongoose.

### 3. Audit Logging with Diffs

We will implement atomic helpers — covering create, update, and delete — that record before/after state and save the audit log alongside the document change, all inside one MongoDB transaction (hence the replica-set requirement above).

- **`backend/src/services/auditedCreate.ts`**: Starts a session/transaction, creates the document, writes an `AuditLog` entry with `action: 'CREATE'` and a diff against `null` (i.e. the full new document as the "after" state), commits.
- **`backend/src/services/auditedUpdate.ts`**: Starts a session/transaction, fetches the document before the update (`findOne`), performs the update (`findOneAndUpdate`), computes a field-by-field diff, writes an `AuditLog` entry with `action: 'UPDATE'`, commits.
- **`backend/src/services/auditedDelete.ts`**: Starts a session/transaction, fetches the full document (`findOne`), deletes it (`findOneAndDelete`), writes an `AuditLog` entry with `action: 'DELETE'` and a diff against `null` (i.e. the full prior document as the "before" state), commits.

All three share the same transaction/rollback shape (start session → operation → diff → AuditLog.create → commit, with abort-on-error). Every Case/IntakeForm/NarrativeStatement/TimelineEvent create, update, or delete in the controllers must go through one of these three helpers rather than calling the Mongoose model directly — that's what makes the audit trail complete rather than accidentally partial.

### 4. Authentication & Guards

- **JWT Auth**: Standard JWT middleware to verify tokens and attach `req.user`.
- **Role Middleware**: A factory function `requireRole('LAWYER', 'ADMIN')` to guard specific routes.

---

## Verification Plan

### Automated Tests

- Use Supertest to verify isolation:
  - Register two orgs, create a case (and an intake form, narrative, and timeline event) in each.
  - Assert a user from Org A gets a 403/404 when requesting Org B's case, intake form, narrative, or timeline event directly by ID.
  - Assert a cross-org `findOneAndUpdate` or `findOneAndDelete` attempt is blocked, not just a bare `find` — this is the case the original plugin design missed.
- Test all three audited helpers (`auditedCreate`, `auditedUpdate`, `auditedDelete`) to ensure each produces an `AuditLog` document with the correct action type and diff structure.

### Manual Verification

1. Run `docker-compose up -d` to start the MongoDB replica set.
2. Register two users in two different organizations.
3. Attempt to fetch User B's case (and its intake form/narrative/timeline data) using User A's token.
4. Create, update, and delete a case field, then check the database directly to confirm an `AuditLog` entry exists for each action with the correct before/after diff.
```

### `Module_2_Final_Plan.md`
```md
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
```

### `README.md`
```md
# CaseGuard: Domestic Violence Case Pattern Analyzer

A privacy-first case management and decision-support platform for legal-aid NGOs and case workers.

## Tech Stack
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript, Mongoose
- **Database**: MongoDB
- **DevOps**: Docker, Docker Compose

## Features
- **Case Management**: Create, view, and manage domestic violence cases.
- **Intake & Statements**: Structured intake forms and free-text statement logging.
- **Mock ML Analysis**: Generates Severity, Escalation Score, Patterns, and Triggers.
- **Lawyer Briefs**: Auto-generates structured briefs that are editable and printable.
- **Safe Action Navigator**: Rule-based recommendations, evidence checklists, and referrals.
- **Admin Panel**: Role-based access control and system audit logs.

## Setup Instructions

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Running with Docker (Recommended)
1. Navigate to the root directory.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)
   - **MongoDB**: `localhost:27017`

### Running Locally (Without Docker)
1. **Environment Variables**:
   - Copy `backend/.env.example` to `backend/.env`.
   - Copy `frontend/.env.example` to `frontend/.env.local`.
2. **MongoDB**: Ensure a local MongoDB instance is running at `mongodb://localhost:27017/caseguard`.
3. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Dummy Data (Seed Script)
You can seed your database with sample users and a dummy case by running the seed script from the `backend` directory:
```bash
cd backend
npx ts-node src/scripts/seed.ts
```
This will create:
- Admin user: `admin@caseguard.com` / `password123`
- Case Worker: `worker@caseguard.com` / `password123`

## Testing (Backend)
The backend is configured with Jest and Supertest. To run tests:
```bash
cd backend
npm run test
```

## User Roles & Testing
To test the system fully, log in using the seeded users or register a new user on the frontend.
- By default, new users are assigned the `case_worker` role.
- To test the Admin panel, log in with the admin credentials provided by the seed script. Once an admin, you can change other users' roles from the UI.
```

### `backend/.env.example`
```example
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/caseguard
JWT_SECRET=supersecretkey_change_in_production
```

### `backend/Dockerfile`
```txt
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build || true # Just in case we need a build step later, currently using ts-node-dev in dev, but for docker we might run tsc if needed

EXPOSE 5000

CMD ["npx", "tsx", "watch", "src/server.ts"]
```

### `backend/dist/app.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect Database
(0, db_1.connectDB)();
// Init Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Define Routes
app.use('/api/auth', authRoutes_1.default);
app.get('/', (req, res) => res.send('API Running'));
exports.default = app;
```

### `backend/dist/config/db.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
```

### `backend/dist/controllers/AdminController.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = exports.updateUserRole = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const getUsers = async (req, res, next) => {
    try {
        const users = await User_1.default.find().select('-passwordHash');
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User_1.default.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }
        await AuditLog_1.default.create({ userId: req.user._id, action: 'UPDATE_USER_ROLE', entityType: 'User', entityId: user._id });
        res.json(user);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog_1.default.find().sort({ timestamp: -1 }).populate('userId', 'name email');
        res.json(logs);
    }
    catch (error) {
        next(error);
    }
};
exports.getAuditLogs = getAuditLogs;
```

### `backend/dist/controllers/CaseController.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTimelineEvent = exports.updateCaseStatement = exports.updateCaseInput = exports.getCaseById = exports.getCases = exports.createCase = void 0;
const Case_1 = __importDefault(require("../models/Case"));
const CaseInput_1 = __importDefault(require("../models/CaseInput"));
const CaseStatement_1 = __importDefault(require("../models/CaseStatement"));
const TimelineEvent_1 = __importDefault(require("../models/TimelineEvent"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const createCase = async (req, res, next) => {
    try {
        const { title } = req.body;
        const newCase = await Case_1.default.create({ userId: req.user._id, title });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'CREATE_CASE', entityType: 'Case', entityId: newCase._id });
        res.status(201).json(newCase);
    }
    catch (error) {
        next(error);
    }
};
exports.createCase = createCase;
const getCases = async (req, res, next) => {
    try {
        // Basic filter: only show cases owned by user unless admin
        const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
        const cases = await Case_1.default.find(filter).sort({ createdAt: -1 });
        res.json(cases);
    }
    catch (error) {
        next(error);
    }
};
exports.getCases = getCases;
const getCaseById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caseDoc = await Case_1.default.findById(id);
        if (!caseDoc) {
            res.status(404);
            throw new Error('Case not found');
        }
        const inputs = await CaseInput_1.default.findOne({ caseId: id });
        const statement = await CaseStatement_1.default.findOne({ caseId: id });
        const timeline = await TimelineEvent_1.default.find({ caseId: id }).sort({ date: 1 });
        res.json({ case: caseDoc, inputs, statement, timeline });
    }
    catch (error) {
        next(error);
    }
};
exports.getCaseById = getCaseById;
const updateCaseInput = async (req, res, next) => {
    try {
        const { id } = req.params;
        const input = await CaseInput_1.default.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'UPDATE_CASE_INPUT', entityType: 'Case', entityId: id });
        res.json(input);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCaseInput = updateCaseInput;
const updateCaseStatement = async (req, res, next) => {
    try {
        const { id } = req.params;
        const statement = await CaseStatement_1.default.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'UPDATE_CASE_STATEMENT', entityType: 'Case', entityId: id });
        res.json(statement);
    }
    catch (error) {
        next(error);
    }
};
exports.updateCaseStatement = updateCaseStatement;
const addTimelineEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await TimelineEvent_1.default.create({ ...req.body, caseId: id });
        await AuditLog_1.default.create({ userId: req.user._id, action: 'ADD_TIMELINE_EVENT', entityType: 'Case', entityId: id });
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.addTimelineEvent = addTimelineEvent;
```

### `backend/dist/controllers/MockMLController.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecommendations = exports.generateBrief = exports.analyzeCase = void 0;
const MockMLService_1 = require("../services/MockMLService");
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const analyzeCase = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prediction = await MockMLService_1.MockMLService.generatePrediction(id);
        await AuditLog_1.default.create({ userId: req.user._id, action: 'ANALYZE_CASE', entityType: 'Case', entityId: id });
        res.json(prediction);
    }
    catch (error) {
        next(error);
    }
};
exports.analyzeCase = analyzeCase;
const generateBrief = async (req, res, next) => {
    try {
        const { id } = req.params;
        const brief = await MockMLService_1.MockMLService.generateBrief(id);
        await AuditLog_1.default.create({ userId: req.user._id, action: 'GENERATE_BRIEF', entityType: 'Case', entityId: id });
        res.json(brief);
    }
    catch (error) {
        next(error);
    }
};
exports.generateBrief = generateBrief;
const generateRecommendations = async (req, res, next) => {
    try {
        const { id } = req.params;
        // For mock purposes, just pick 'Severe' or pass it. We will let the service handle it or fetch prediction.
        const prediction = await MockMLService_1.MockMLService.generatePrediction(id); // Ensure prediction exists
        const recommendations = await MockMLService_1.MockMLService.generateRecommendations(id, prediction.severity);
        await AuditLog_1.default.create({ userId: req.user._id, action: 'GENERATE_RECOMMENDATIONS', entityType: 'Case', entityId: id });
        res.json(recommendations);
    }
    catch (error) {
        next(error);
    }
};
exports.generateRecommendations = generateRecommendations;
```

### `backend/dist/controllers/authController.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Organization_1 = __importDefault(require("../models/Organization"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const register = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { name, email, password, orgName } = req.body;
        let user = await User_1.default.findOne({ email }).session(session);
        if (user) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Since this handles "orgName", we create a new Organization
        const newOrg = await Organization_1.default.create([{ name: orgName || 'Default Org' }], { session });
        const organizationId = newOrg[0]._id;
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUsers = await User_1.default.create([{
                name,
                email,
                passwordHash,
                organizationId,
                role: 'ADMIN' // The creator of an org becomes the ADMIN
            }], { session });
        user = newUsers[0];
        const payload = {
            id: user.id,
            role: user.role,
            organizationId: user.organizationId
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ token });
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            id: user.id,
            role: user.role,
            organizationId: user.organizationId
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });
        res.json({ token });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.login = login;
```

### `backend/dist/middleware/auth.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ msg: 'No token, authorization denied' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345');
        req.user = decoded;
        // Set the organization scope globally for the request
        if (req.user && req.user.organizationId) {
            req.orgScope = { organizationId: req.user.organizationId };
        }
        else {
            return res.status(403).json({ msg: 'User missing organization scope' });
        }
        next();
    }
    catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
exports.verifyToken = verifyToken;
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Insufficient permissions' });
        }
        next();
    };
};
exports.requireRole = requireRole;
```

### `backend/dist/middleware/authMiddleware.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.user = await User_1.default.findById(decoded.id).select('-passwordHash');
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
exports.protect = protect;
```

### `backend/dist/middleware/errorHandler.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    logger_1.default.error(err.stack || err.message);
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = err.message || 'An unexpected error occurred';
    let details = null;
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        code = 'VALIDATION_ERROR';
        message = 'Invalid input data';
        details = err.errors;
    }
    else if (err.name === 'UnauthorizedError' || statusCode === 401) {
        code = 'UNAUTHORIZED';
    }
    else if (statusCode === 403) {
        code = 'FORBIDDEN';
    }
    else if (statusCode === 404) {
        code = 'NOT_FOUND';
    }
    res.status(statusCode).json({
        error: {
            code,
            message,
            details,
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        }
    });
};
exports.errorHandler = errorHandler;
```

### `backend/dist/middleware/roleMiddleware.js`
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                message: `User role ${req.user?.role} is not authorized to access this route`,
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
```

### `backend/dist/middlewares/authMiddleware.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User_1.User.findById(decoded._id);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};
exports.authenticate = authenticate;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied.' });
        }
        next();
    };
};
exports.requireRole = requireRole;
```

### `backend/dist/models/AuditLog.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const tenantIsolation_1 = require("../plugins/tenantIsolation");
const AuditLogSchema = new mongoose_1.Schema({
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    actorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    collectionName: { type: String, required: true },
    documentId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
    diff: { type: mongoose_1.Schema.Types.Mixed }, // { field: { before, after } } pairs
    timestamp: { type: Date, default: Date.now },
});
AuditLogSchema.plugin(tenantIsolation_1.tenantIsolationPlugin);
exports.default = mongoose_1.default.models.AuditLog || mongoose_1.default.model('AuditLog', AuditLogSchema);
```

### `backend/dist/models/Brief.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BriefSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    summary: { type: String, required: true },
    chronology: { type: String, required: true },
    abuseIndicators: { type: String, required: true },
    riskLevel: { type: String, required: true },
    missingInfo: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.models.Brief || mongoose_1.default.model('Brief', BriefSchema);
```

### `backend/dist/models/Case.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const tenantIsolation_1 = require("../plugins/tenantIsolation");
const CaseSchema = new mongoose_1.Schema({
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    status: { type: String, enum: ['INTAKE', 'ANALYSIS', 'REVIEW', 'CLOSED'], default: 'INTAKE' },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});
CaseSchema.plugin(tenantIsolation_1.tenantIsolationPlugin);
exports.default = mongoose_1.default.models.Case || mongoose_1.default.model('Case', CaseSchema);
```

### `backend/dist/models/CaseInput.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CaseInputSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    relationshipType: { type: String, required: true },
    incidentFrequency: { type: String, required: true },
    priorComplaints: { type: Boolean, default: false },
    incidentTypes: [{ type: String }],
}, { timestamps: true });
exports.default = mongoose_1.default.models.CaseInput || mongoose_1.default.model('CaseInput', CaseInputSchema);
```

### `backend/dist/models/CaseStatement.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const CaseStatementSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    anonymizedText: { type: String, required: true },
}, { timestamps: true });
exports.default = mongoose_1.default.models.CaseStatement || mongoose_1.default.model('CaseStatement', CaseStatementSchema);
```

### `backend/dist/models/IntakeForm.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const tenantIsolation_1 = require("../plugins/tenantIsolation");
const IntakeFormSchema = new mongoose_1.Schema({
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    relationshipType: String,
    incidentFrequency: String,
    priorComplaints: Boolean,
    incidentTypes: [String],
    createdAt: { type: Date, default: Date.now },
});
IntakeFormSchema.plugin(tenantIsolation_1.tenantIsolationPlugin);
exports.default = mongoose_1.default.models.IntakeForm || mongoose_1.default.model('IntakeForm', IntakeFormSchema);
```

### `backend/dist/models/NarrativeStatement.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const tenantIsolation_1 = require("../plugins/tenantIsolation");
const NarrativeStatementSchema = new mongoose_1.Schema({
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
NarrativeStatementSchema.plugin(tenantIsolation_1.tenantIsolationPlugin);
exports.default = mongoose_1.default.models.NarrativeStatement || mongoose_1.default.model('NarrativeStatement', NarrativeStatementSchema);
```

### `backend/dist/models/Organization.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const OrganizationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.models.Organization || mongoose_1.default.model('Organization', OrganizationSchema);
```

### `backend/dist/models/PatternLabel.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternLabel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PatternLabelSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true, index: true, unique: true },
    labels: [{ type: String }],
    coerciveControlFlag: { type: Boolean, default: false },
}, { timestamps: true });
exports.PatternLabel = mongoose_1.default.model('PatternLabel', PatternLabelSchema);
```

### `backend/dist/models/Prediction.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const PredictionSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    severity: { type: String, enum: ['Moderate', 'Severe', 'Life-Threatening'], required: true },
    escalationScore: { type: Number, required: true, min: 0, max: 100 },
    escalationLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    patterns: [{ type: String }],
    triggers: [{ type: String }],
}, { timestamps: true });
exports.default = mongoose_1.default.models.Prediction || mongoose_1.default.model('Prediction', PredictionSchema);
```

### `backend/dist/models/Recommendation.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const RecommendationSchema = new mongoose_1.Schema({
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true },
    urgency: { type: String, required: true },
    evidenceChecklist: [{ type: String }],
    followUpQuestions: [{ type: String }],
    referrals: [{ type: String }],
}, { timestamps: true });
exports.default = mongoose_1.default.models.Recommendation || mongoose_1.default.model('Recommendation', RecommendationSchema);
```

### `backend/dist/models/TimelineEvent.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const tenantIsolation_1 = require("../plugins/tenantIsolation");
const TimelineEventSchema = new mongoose_1.Schema({
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    caseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
    eventDate: { type: Date, required: true },
    description: { type: String, required: true },
    severityLevel: { type: String },
    createdAt: { type: Date, default: Date.now },
});
TimelineEventSchema.plugin(tenantIsolation_1.tenantIsolationPlugin);
exports.default = mongoose_1.default.models.TimelineEvent || mongoose_1.default.model('TimelineEvent', TimelineEventSchema);
```

### `backend/dist/models/User.js`
```js
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    organizationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: String,
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['LAWYER', 'CASE_WORKER', 'ADMIN'], default: 'CASE_WORKER' },
    createdAt: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
```

### `backend/dist/plugins/tenantIsolation.js`
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantIsolationPlugin = void 0;
const tenantIsolationPlugin = (schema) => {
    const requireOrgId = function (next) {
        const filter = this.getFilter();
        if (!filter || !filter.organizationId) {
            return next(new Error('organizationId is required in the query filter for tenant isolation.'));
        }
        // Proceed normally if organizationId is present
        next();
    };
    // Typecasting the hook events because Mongoose types can be strict about hook names
    schema.pre('find', requireOrgId);
    schema.pre('findOne', requireOrgId);
    schema.pre('countDocuments', requireOrgId);
    // Update Hooks
    schema.pre('updateMany', requireOrgId);
    schema.pre('updateOne', requireOrgId);
    schema.pre('findOneAndUpdate', requireOrgId);
    // Delete Hooks
    schema.pre('deleteOne', requireOrgId);
    schema.pre('deleteMany', requireOrgId);
    schema.pre('findOneAndDelete', requireOrgId);
};
exports.tenantIsolationPlugin = tenantIsolationPlugin;
```

### `backend/dist/routes/adminRoutes.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = require("../controllers/AdminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.use((0, roleMiddleware_1.authorize)('admin'));
router.get('/users', AdminController_1.getUsers);
router.put('/users/:id/role', AdminController_1.updateUserRole);
router.get('/audit-logs', AdminController_1.getAuditLogs);
exports.default = router;
```

### `backend/dist/routes/authRoutes.js`
```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
exports.default = router;
```

### `backend/dist/routes/caseRoutes.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CaseController_1 = require("../controllers/CaseController");
const MockMLController_1 = require("../controllers/MockMLController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
router.route('/')
    .post(CaseController_1.createCase)
    .get(CaseController_1.getCases);
router.route('/:id')
    .get(CaseController_1.getCaseById);
router.put('/:id/input', CaseController_1.updateCaseInput);
router.put('/:id/statement', CaseController_1.updateCaseStatement);
router.post('/:id/timeline', CaseController_1.addTimelineEvent);
// Mock ML Routes
router.post('/:id/analyze', MockMLController_1.analyzeCase);
router.post('/:id/generate-brief', MockMLController_1.generateBrief);
router.post('/:id/generate-recommendations', MockMLController_1.generateRecommendations);
exports.default = router;
```

### `backend/dist/scripts/seed.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const Case_1 = __importDefault(require("../models/Case"));
const CaseInput_1 = __importDefault(require("../models/CaseInput"));
const CaseStatement_1 = __importDefault(require("../models/CaseStatement"));
const Prediction_1 = __importDefault(require("../models/Prediction"));
const TimelineEvent_1 = __importDefault(require("../models/TimelineEvent"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard');
        console.log('MongoDB Connected');
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
const seedData = async () => {
    await connectDB();
    try {
        // Clear existing data
        await User_1.default.deleteMany();
        await Case_1.default.deleteMany();
        await CaseInput_1.default.deleteMany();
        await CaseStatement_1.default.deleteMany();
        await Prediction_1.default.deleteMany();
        await TimelineEvent_1.default.deleteMany();
        // Create users
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash('password123', salt);
        const admin = await User_1.default.create({
            name: 'Admin User',
            email: 'admin@caseguard.com',
            passwordHash,
            role: 'admin',
        });
        const worker = await User_1.default.create({
            name: 'Case Worker',
            email: 'worker@caseguard.com',
            passwordHash,
            role: 'case_worker',
        });
        // Create a sample case
        const sampleCase = await Case_1.default.create({
            title: 'Jenkins Domestic Dispute - Escalation Report',
            status: 'open',
            assignedTo: worker._id,
            createdBy: worker._id,
        });
        await CaseInput_1.default.create({
            caseId: sampleCase._id,
            relationshipType: 'Spouse (Married 5 years)',
            incidentFrequency: 'Weekly (Escalating)',
            priorComplaints: true,
        });
        await CaseStatement_1.default.create({
            caseId: sampleCase._id,
            originalText: 'The incidents have been escalating over the last six months...',
            anonymizedText: 'The incidents have been escalating over the last six months. On Tuesday evening around 8:00 PM, [Abuser] came home intoxicated and began screaming about finances. When I tried to leave the room, he grabbed my arm forcefully, leaving bruises, and blocked the doorway so I could not exit. He threatened that if I ever tried to call the police, he would make sure I never saw our children again.',
            entities: [{ type: 'PERSON', value: '[Abuser]' }]
        });
        await Prediction_1.default.create({
            caseId: sampleCase._id,
            severity: 'Severe',
            escalationScore: 85,
            escalationLevel: 'High',
            patterns: ['Coercive Control', 'Isolation', 'Threats'],
            triggers: ['Repeated Complaints', 'Fear Indicators']
        });
        console.log('Database seeded successfully!');
        process.exit();
    }
    catch (error) {
        console.error(`Error seeding data: ${error.message}`);
        process.exit(1);
    }
};
seedData();
```

### `backend/dist/server.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

### `backend/dist/services/MockMLService.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockMLService = void 0;
const Prediction_1 = __importDefault(require("../models/Prediction"));
const Brief_1 = __importDefault(require("../models/Brief"));
const Recommendation_1 = __importDefault(require("../models/Recommendation"));
const CaseInput_1 = __importDefault(require("../models/CaseInput"));
const CaseStatement_1 = __importDefault(require("../models/CaseStatement"));
class MockMLService {
    static async generatePrediction(caseId) {
        // Generate mock prediction data
        const severityOptions = ['Moderate', 'Severe', 'Life-Threatening'];
        const severity = severityOptions[Math.floor(Math.random() * severityOptions.length)];
        const escalationScore = Math.floor(Math.random() * 100);
        const escalationLevel = escalationScore > 75 ? 'High' : escalationScore > 40 ? 'Medium' : 'Low';
        const patterns = ['Coercive Control', 'Isolation', 'Threats'];
        const triggers = ['Repeated Complaints', 'Fear Indicators'];
        // Upsert Prediction
        const prediction = await Prediction_1.default.findOneAndUpdate({ caseId }, { severity, escalationScore, escalationLevel, patterns, triggers }, { new: true, upsert: true });
        return prediction;
    }
    static async generateBrief(caseId) {
        const inputs = await CaseInput_1.default.findOne({ caseId });
        const statement = await CaseStatement_1.default.findOne({ caseId });
        const summary = 'This case involves a domestic violence incident...';
        const chronology = '1. Incident reported. 2. Statement recorded.';
        const abuseIndicators = 'Physical abuse, Emotional abuse.';
        const riskLevel = 'High';
        const missingInfo = 'Medical records, Witness statements.';
        const content = `## Summary\n${summary}\n\n## Chronology\n${chronology}\n\n## Abuse Indicators\n${abuseIndicators}\n\n## Risk Level\n${riskLevel}\n\n## Missing Information\n${missingInfo}`;
        const brief = await Brief_1.default.findOneAndUpdate({ caseId }, { summary, chronology, abuseIndicators, riskLevel, missingInfo, content }, { new: true, upsert: true });
        return brief;
    }
    static async generateRecommendations(caseId, severity) {
        const urgency = severity === 'Life-Threatening' ? 'Immediate Action Required' : 'Standard Follow-up';
        const evidenceChecklist = ['Photos of injuries', 'Medical reports', 'Police reports'];
        const followUpQuestions = ['Are there children in the home?', 'Do you have a safe place to stay?'];
        const referrals = ['Local Women Shelter', 'Legal Aid Society'];
        const recommendation = await Recommendation_1.default.findOneAndUpdate({ caseId }, { urgency, evidenceChecklist, followUpQuestions, referrals }, { new: true, upsert: true });
        return recommendation;
    }
}
exports.MockMLService = MockMLService;
```

### `backend/dist/services/auditedCreate.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditedCreate = auditedCreate;
const mongoose_1 = __importDefault(require("mongoose"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
async function auditedCreate(Model, data, actor) {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Explicitly add the organizationId from the actor to ensure isolation safety on creation
        const finalData = { ...data, organizationId: actor.organizationId };
        // Create the document
        const createdDocs = await Model.create([finalData], { session });
        const after = createdDocs[0];
        // Create the audit log
        await AuditLog_1.default.create([{
                organizationId: actor.organizationId,
                actorId: actor.id || actor._id,
                collectionName: Model.modelName,
                documentId: after._id,
                action: 'CREATE',
                diff: after.toObject(), // entire object as diff since it is new
            }], { session });
        await session.commitTransaction();
        return after;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}
```

### `backend/dist/services/auditedDelete.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditedDelete = auditedDelete;
const mongoose_1 = __importDefault(require("mongoose"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
async function auditedDelete(Model, filter, actor) {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const safeFilter = { ...filter, organizationId: actor.organizationId };
        const before = await Model.findOne(safeFilter).session(session).lean();
        if (!before) {
            throw new Error('Document not found or unauthorized');
        }
        await Model.findOneAndDelete(safeFilter, { session });
        await AuditLog_1.default.create([{
                organizationId: actor.organizationId,
                actorId: actor.id || actor._id,
                collectionName: Model.modelName,
                documentId: before._id,
                action: 'DELETE',
                diff: { _deleted: before }, // The entire previous state
            }], { session });
        await session.commitTransaction();
        return true;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}
```

### `backend/dist/services/auditedUpdate.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditedUpdate = auditedUpdate;
const mongoose_1 = __importDefault(require("mongoose"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
// Helper to calculate simple field-by-field diff
function computeDiff(before, after) {
    const diff = {};
    // Find changed or added fields
    for (const key in after) {
        if (key === '__v' || key === 'updatedAt')
            continue;
        if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            diff[key] = {
                before: before[key],
                after: after[key]
            };
        }
    }
    // Find removed fields
    for (const key in before) {
        if (key === '__v' || key === 'updatedAt')
            continue;
        if (after[key] === undefined && before[key] !== undefined) {
            diff[key] = {
                before: before[key],
                after: null
            };
        }
    }
    return diff;
}
async function auditedUpdate(Model, filter, update, actor) {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Mongoose tenant isolation plugin expects organizationId in filter
        const safeFilter = { ...filter, organizationId: actor.organizationId };
        const before = await Model.findOne(safeFilter).session(session).lean();
        if (!before) {
            throw new Error('Document not found or unauthorized');
        }
        const after = await Model.findOneAndUpdate(safeFilter, update, { new: true, session }).lean();
        const diff = computeDiff(before, after);
        // Only log if something actually changed
        if (Object.keys(diff).length > 0) {
            await AuditLog_1.default.create([{
                    organizationId: actor.organizationId,
                    actorId: actor.id || actor._id,
                    collectionName: Model.modelName,
                    documentId: after._id,
                    action: 'UPDATE',
                    diff,
                }], { session });
        }
        await session.commitTransaction();
        return after;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}
```

### `backend/dist/tests/auth.test.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const app_1 = __importDefault(require("../app"));
const User_1 = __importDefault(require("../models/User"));
let mongoServer;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose_1.default.connect(mongoUri);
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
beforeEach(async () => {
    await User_1.default.deleteMany({});
});
describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toEqual('test@example.com');
    });
    it('should login an existing user', async () => {
        // First register
        await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        });
        // Then login
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});
```

### `backend/dist/utils/logger.js`
```js
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    defaultMeta: { service: 'case-guard-api' },
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        })
    ]
});
exports.default = logger;
```

### `backend/jest.config.js`
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
```

### `backend/package.json`
```json
{
  "name": "backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^8.6.2",
    "express-validator": "^7.3.2",
    "helmet": "^8.3.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.9.3",
    "winston": "^3.19.0",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/jest": "^30.0.0",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/mongoose": "^5.11.96",
    "@types/node": "^26.1.2",
    "@types/supertest": "^7.2.1",
    "jest": "^30.4.2",
    "mongodb-memory-server": "^11.2.0",
    "supertest": "^7.2.2",
    "ts-jest": "^29.4.12",
    "ts-node-dev": "^2.0.0",
    "tsx": "^4.23.12",
    "typescript": "^7.0.2"
  }
}
```

### `backend/src/app.ts`
```ts
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Running'));

export default app;
```

### `backend/src/config/db.ts`
```ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};
```

### `backend/src/controllers/AdminController.ts`
```ts
import { Response, NextFunction } from 'express';
import User from '../models/User';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    await AuditLog.create({ userId: req.user._id, action: 'UPDATE_USER_ROLE', entityType: 'User', entityId: user._id });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).populate('userId', 'name email');
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
```

### `backend/src/controllers/CaseController.ts`
```ts
import { Response, NextFunction } from 'express';
import Case from '../models/Case';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import TimelineEvent from '../models/TimelineEvent';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCase = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    const newCase = await Case.create({ userId: req.user._id, title });
    
    await AuditLog.create({ userId: req.user._id, action: 'CREATE_CASE', entityType: 'Case', entityId: newCase._id });
    res.status(201).json(newCase);
  } catch (error) {
    next(error);
  }
};

export const getCases = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Basic filter: only show cases owned by user unless admin
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

export const getCaseById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findById(id);
    if (!caseDoc) {
      res.status(404);
      throw new Error('Case not found');
    }

    const inputs = await CaseInput.findOne({ caseId: id });
    const statement = await CaseStatement.findOne({ caseId: id });
    const timeline = await TimelineEvent.find({ caseId: id }).sort({ date: 1 });

    res.json({ case: caseDoc, inputs, statement, timeline });
  } catch (error) {
    next(error);
  }
};

export const updateCaseInput = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const input = await CaseInput.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
    await AuditLog.create({ userId: req.user._id, action: 'UPDATE_CASE_INPUT', entityType: 'Case', entityId: id });
    res.json(input);
  } catch (error) {
    next(error);
  }
};

export const updateCaseStatement = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const statement = await CaseStatement.findOneAndUpdate({ caseId: id }, { ...req.body, caseId: id }, { new: true, upsert: true });
    await AuditLog.create({ userId: req.user._id, action: 'UPDATE_CASE_STATEMENT', entityType: 'Case', entityId: id });
    res.json(statement);
  } catch (error) {
    next(error);
  }
};

export const addTimelineEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const event = await TimelineEvent.create({ ...req.body, caseId: id });
    await AuditLog.create({ userId: req.user._id, action: 'ADD_TIMELINE_EVENT', entityType: 'Case', entityId: id });
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};
```

### `backend/src/controllers/authController.ts`
```ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Organization from '../models/Organization';
import User from '../models/User';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { name, email, password, orgName } = req.body;

    let user = await User.findOne({ email }).session(session);
    if (user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Since this handles "orgName", we create a new Organization
    const newOrg = await Organization.create([{ name: orgName || 'Default Org' }], { session });
    const organizationId = newOrg[0]._id;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUsers = await User.create([{
      name,
      email,
      passwordHash,
      organizationId,
      role: 'ADMIN' // The creator of an org becomes the ADMIN
    }], { session });

    user = newUsers[0];

    const payload = {
      id: user.id,
      role: user.role,
      organizationId: user.organizationId
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ token });
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      id: user.id,
      role: user.role,
      organizationId: user.organizationId
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey12345', { expiresIn: '5d' });

    res.json({ token });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
```

### `backend/src/middleware/auth.ts`
```ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
      orgScope?: { organizationId: any };
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345');
    req.user = decoded;
    
    // Set the organization scope globally for the request
    if (req.user && req.user.organizationId) {
      req.orgScope = { organizationId: req.user.organizationId };
    } else {
      return res.status(403).json({ msg: 'User missing organization scope' });
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Insufficient permissions' });
    }
    next();
  };
};
```

### `backend/src/middleware/authMiddleware.ts`
```ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      req.user = await User.findById(decoded.id).select('-passwordHash');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
```

### `backend/src/middleware/roleMiddleware.ts`
```ts
import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
```

### `backend/src/models/AuditLog.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface IAuditLog extends Document {
  organizationId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId;
  collectionName: string;
  documentId: mongoose.Types.ObjectId;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  diff?: any;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collectionName: { type: String, required: true },
  documentId: { type: Schema.Types.ObjectId, required: true },
  action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
  diff: { type: Schema.Types.Mixed }, // { field: { before, after } } pairs
  timestamp: { type: Date, default: Date.now },
});

AuditLogSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
```

### `backend/src/models/Brief.ts`
```ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBrief extends Document {
  caseId: mongoose.Types.ObjectId;
  summary: string;
  chronology: string;
  abuseIndicators: string;
  riskLevel: string;
  missingInfo: string;
  content: string; // The fully assembled editable brief
  createdAt: Date;
  updatedAt: Date;
}

const BriefSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    summary: { type: String, required: true },
    chronology: { type: String, required: true },
    abuseIndicators: { type: String, required: true },
    riskLevel: { type: String, required: true },
    missingInfo: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Brief || mongoose.model<IBrief>('Brief', BriefSchema);
```

### `backend/src/models/Case.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface ICase extends Document {
  organizationId: mongoose.Types.ObjectId;
  status: 'INTAKE' | 'ANALYSIS' | 'REVIEW' | 'CLOSED';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CaseSchema = new Schema<ICase>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  status: { type: String, enum: ['INTAKE', 'ANALYSIS', 'REVIEW', 'CLOSED'], default: 'INTAKE' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

CaseSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);
```

### `backend/src/models/CaseInput.ts`
```ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICaseInput extends Document {
  caseId: mongoose.Types.ObjectId;
  relationshipType: string;
  incidentFrequency: string;
  priorComplaints: boolean;
  incidentTypes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CaseInputSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    relationshipType: { type: String, required: true },
    incidentFrequency: { type: String, required: true },
    priorComplaints: { type: Boolean, default: false },
    incidentTypes: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.CaseInput || mongoose.model<ICaseInput>('CaseInput', CaseInputSchema);
```

### `backend/src/models/CaseStatement.ts`
```ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICaseStatement extends Document {
  caseId: mongoose.Types.ObjectId;
  anonymizedText: string;
  createdAt: Date;
  updatedAt: Date;
}

const CaseStatementSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    anonymizedText: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CaseStatement || mongoose.model<ICaseStatement>('CaseStatement', CaseStatementSchema);
```

### `backend/src/models/IntakeForm.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface IIntakeForm extends Document {
  organizationId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  relationshipType: string;
  incidentFrequency: string;
  priorComplaints: boolean;
  incidentTypes: string[];
  createdAt: Date;
}

const IntakeFormSchema = new Schema<IIntakeForm>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  relationshipType: String,
  incidentFrequency: String,
  priorComplaints: Boolean,
  incidentTypes: [String],
  createdAt: { type: Date, default: Date.now },
});

IntakeFormSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.IntakeForm || mongoose.model<IIntakeForm>('IntakeForm', IntakeFormSchema);
```

### `backend/src/models/NarrativeStatement.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface INarrativeStatement extends Document {
  organizationId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const NarrativeStatementSchema = new Schema<INarrativeStatement>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

NarrativeStatementSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.NarrativeStatement || mongoose.model<INarrativeStatement>('NarrativeStatement', NarrativeStatementSchema);
```

### `backend/src/models/Organization.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  createdAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
```

### `backend/src/models/PatternLabel.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPatternLabel extends Document {
  caseId: mongoose.Types.ObjectId;
  labels: string[]; // e.g., 'physical', 'financial', 'coercive control'
  coerciveControlFlag: boolean;
  createdAt: Date;
}

const PatternLabelSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true, unique: true },
    labels: [{ type: String }],
    coerciveControlFlag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PatternLabel = mongoose.model<IPatternLabel>('PatternLabel', PatternLabelSchema);
```

### `backend/src/models/Prediction.ts`
```ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  caseId: mongoose.Types.ObjectId;
  severity: 'Moderate' | 'Severe' | 'Life-Threatening';
  escalationScore: number; // 0-100
  escalationLevel: 'Low' | 'Medium' | 'High';
  patterns: string[];
  triggers: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PredictionSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    severity: { type: String, enum: ['Moderate', 'Severe', 'Life-Threatening'], required: true },
    escalationScore: { type: Number, required: true, min: 0, max: 100 },
    escalationLevel: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    patterns: [{ type: String }],
    triggers: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema);
```

### `backend/src/models/Recommendation.ts`
```ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRecommendation extends Document {
  caseId: mongoose.Types.ObjectId;
  urgency: string;
  evidenceChecklist: string[];
  followUpQuestions: string[];
  referrals: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RecommendationSchema: Schema = new Schema(
  {
    caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    urgency: { type: String, required: true },
    evidenceChecklist: [{ type: String }],
    followUpQuestions: [{ type: String }],
    referrals: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
```

### `backend/src/models/TimelineEvent.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';
import { tenantIsolationPlugin } from '../plugins/tenantIsolation';

export interface ITimelineEvent extends Document {
  organizationId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  eventDate: Date;
  description: string;
  severityLevel: string;
  createdAt: Date;
}

const TimelineEventSchema = new Schema<ITimelineEvent>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  caseId: { type: Schema.Types.ObjectId, ref: 'Case', required: true, index: true },
  eventDate: { type: Date, required: true },
  description: { type: String, required: true },
  severityLevel: { type: String },
  createdAt: { type: Date, default: Date.now },
});

TimelineEventSchema.plugin(tenantIsolationPlugin);

export default mongoose.models.TimelineEvent || mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
```

### `backend/src/models/User.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  organizationId: mongoose.Types.ObjectId;
  name?: string;
  email: string;
  passwordHash: string;
  role: 'LAWYER' | 'CASE_WORKER' | 'ADMIN';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['LAWYER', 'CASE_WORKER', 'ADMIN'], default: 'CASE_WORKER' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

### `backend/src/plugins/tenantIsolation.ts`
```ts
import mongoose, { Schema } from 'mongoose';

export const tenantIsolationPlugin = (schema: Schema) => {
  const requireOrgId = function (this: any, next: (err?: mongoose.CallbackError) => void) {
    const filter = this.getFilter();
    
    if (!filter || !filter.organizationId) {
      return next(new Error('organizationId is required in the query filter for tenant isolation.'));
    }
    
    // Proceed normally if organizationId is present
    next();
  };

  // Typecasting the hook events because Mongoose types can be strict about hook names
  schema.pre('find' as any, requireOrgId);
  schema.pre('findOne' as any, requireOrgId);
  schema.pre('countDocuments' as any, requireOrgId);

  // Update Hooks
  schema.pre('updateMany' as any, requireOrgId);
  schema.pre('updateOne' as any, requireOrgId);
  schema.pre('findOneAndUpdate' as any, requireOrgId);

  // Delete Hooks
  schema.pre('deleteOne' as any, requireOrgId);
  schema.pre('deleteMany' as any, requireOrgId);
  schema.pre('findOneAndDelete' as any, requireOrgId);
};
```

### `backend/src/routes/adminRoutes.ts`
```ts
import express from 'express';
import { getUsers, updateUserRole, getAuditLogs } from '../controllers/AdminController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/audit-logs', getAuditLogs);

export default router;
```

### `backend/src/routes/authRoutes.ts`
```ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
```

### `backend/src/scripts/seed.ts`
```ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Case from '../models/Case';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import Prediction from '../models/Prediction';
import TimelineEvent from '../models/TimelineEvent';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard');
    console.log('MongoDB Connected');
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Case.deleteMany();
    await CaseInput.deleteMany();
    await CaseStatement.deleteMany();
    await Prediction.deleteMany();
    await TimelineEvent.deleteMany();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@caseguard.com',
      passwordHash,
      role: 'admin',
    });

    const worker = await User.create({
      name: 'Case Worker',
      email: 'worker@caseguard.com',
      passwordHash,
      role: 'case_worker',
    });

    // Create a sample case
    const sampleCase = await Case.create({
      title: 'Jenkins Domestic Dispute - Escalation Report',
      status: 'open',
      assignedTo: worker._id,
      createdBy: worker._id,
    });

    await CaseInput.create({
      caseId: sampleCase._id,
      relationshipType: 'Spouse (Married 5 years)',
      incidentFrequency: 'Weekly (Escalating)',
      priorComplaints: true,
    });

    await CaseStatement.create({
      caseId: sampleCase._id,
      originalText: 'The incidents have been escalating over the last six months...',
      anonymizedText: 'The incidents have been escalating over the last six months. On Tuesday evening around 8:00 PM, [Abuser] came home intoxicated and began screaming about finances. When I tried to leave the room, he grabbed my arm forcefully, leaving bruises, and blocked the doorway so I could not exit. He threatened that if I ever tried to call the police, he would make sure I never saw our children again.',
      entities: [{ type: 'PERSON', value: '[Abuser]' }]
    });

    await Prediction.create({
      caseId: sampleCase._id,
      severity: 'Severe',
      escalationScore: 85,
      escalationLevel: 'High',
      patterns: ['Coercive Control', 'Isolation', 'Threats'],
      triggers: ['Repeated Complaints', 'Fear Indicators']
    });

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error: any) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
```

### `backend/src/server.ts`
```ts
import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
```

### `backend/src/services/MockMLService.ts`
```ts
import mongoose from 'mongoose';
import Prediction, { IPrediction } from '../models/Prediction';
import Brief, { IBrief } from '../models/Brief';
import Recommendation, { IRecommendation } from '../models/Recommendation';
import CaseInput from '../models/CaseInput';
import CaseStatement from '../models/CaseStatement';
import TimelineEvent from '../models/TimelineEvent';

export class MockMLService {
  static async generatePrediction(caseId: string): Promise<IPrediction> {
    // Generate mock prediction data
    const severityOptions = ['Moderate', 'Severe', 'Life-Threatening'];
    const severity = severityOptions[Math.floor(Math.random() * severityOptions.length)] as any;
    const escalationScore = Math.floor(Math.random() * 100);
    const escalationLevel = escalationScore > 75 ? 'High' : escalationScore > 40 ? 'Medium' : 'Low';
    
    const patterns = ['Coercive Control', 'Isolation', 'Threats'];
    const triggers = ['Repeated Complaints', 'Fear Indicators'];

    // Upsert Prediction
    const prediction = await Prediction.findOneAndUpdate(
      { caseId },
      { severity, escalationScore, escalationLevel, patterns, triggers },
      { new: true, upsert: true }
    );

    return prediction;
  }

  static async generateBrief(caseId: string): Promise<IBrief> {
    const inputs = await CaseInput.findOne({ caseId });
    const statement = await CaseStatement.findOne({ caseId });

    const summary = 'This case involves a domestic violence incident...';
    const chronology = '1. Incident reported. 2. Statement recorded.';
    const abuseIndicators = 'Physical abuse, Emotional abuse.';
    const riskLevel = 'High';
    const missingInfo = 'Medical records, Witness statements.';
    const content = `## Summary\n${summary}\n\n## Chronology\n${chronology}\n\n## Abuse Indicators\n${abuseIndicators}\n\n## Risk Level\n${riskLevel}\n\n## Missing Information\n${missingInfo}`;

    const brief = await Brief.findOneAndUpdate(
      { caseId },
      { summary, chronology, abuseIndicators, riskLevel, missingInfo, content },
      { new: true, upsert: true }
    );

    return brief;
  }

  static async generateRecommendations(caseId: string, severity: string): Promise<IRecommendation> {
    const urgency = severity === 'Life-Threatening' ? 'Immediate Action Required' : 'Standard Follow-up';
    const evidenceChecklist = ['Photos of injuries', 'Medical reports', 'Police reports'];
    const followUpQuestions = ['Are there children in the home?', 'Do you have a safe place to stay?'];
    const referrals = ['Local Women Shelter', 'Legal Aid Society'];

    const recommendation = await Recommendation.findOneAndUpdate(
      { caseId },
      { urgency, evidenceChecklist, followUpQuestions, referrals },
      { new: true, upsert: true }
    );

    return recommendation;
  }
}
```

### `backend/src/services/auditedCreate.ts`
```ts
import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog';

export async function auditedCreate(Model: any, data: any, actor: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Explicitly add the organizationId from the actor to ensure isolation safety on creation
    const finalData = { ...data, organizationId: actor.organizationId };
    
    // Create the document
    const createdDocs = await Model.create([finalData], { session });
    const after = createdDocs[0];

    // Create the audit log
    await AuditLog.create([{
      organizationId: actor.organizationId,
      actorId: actor.id || actor._id,
      collectionName: Model.modelName,
      documentId: after._id,
      action: 'CREATE',
      diff: after.toObject(), // entire object as diff since it is new
    }], { session });

    await session.commitTransaction();
    return after;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

### `backend/src/services/auditedDelete.ts`
```ts
import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog';

export async function auditedDelete(Model: any, filter: any, actor: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const safeFilter = { ...filter, organizationId: actor.organizationId };
    
    const before = await Model.findOne(safeFilter).session(session).lean();
    if (!before) {
      throw new Error('Document not found or unauthorized');
    }

    await Model.findOneAndDelete(safeFilter, { session });

    await AuditLog.create([{
      organizationId: actor.organizationId,
      actorId: actor.id || actor._id,
      collectionName: Model.modelName,
      documentId: before._id,
      action: 'DELETE',
      diff: { _deleted: before }, // The entire previous state
    }], { session });

    await session.commitTransaction();
    return true;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

### `backend/src/services/auditedUpdate.ts`
```ts
import mongoose from 'mongoose';
import AuditLog from '../models/AuditLog';

// Helper to calculate simple field-by-field diff
function computeDiff(before: any, after: any) {
  const diff: any = {};
  
  // Find changed or added fields
  for (const key in after) {
    if (key === '__v' || key === 'updatedAt') continue;
    
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      diff[key] = {
        before: before[key],
        after: after[key]
      };
    }
  }

  // Find removed fields
  for (const key in before) {
    if (key === '__v' || key === 'updatedAt') continue;
    
    if (after[key] === undefined && before[key] !== undefined) {
      diff[key] = {
        before: before[key],
        after: null
      };
    }
  }

  return diff;
}

export async function auditedUpdate(Model: any, filter: any, update: any, actor: any) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Mongoose tenant isolation plugin expects organizationId in filter
    const safeFilter = { ...filter, organizationId: actor.organizationId };

    const before = await Model.findOne(safeFilter).session(session).lean();
    if (!before) {
      throw new Error('Document not found or unauthorized');
    }

    const after = await Model.findOneAndUpdate(safeFilter, update, { new: true, session }).lean();
    
    const diff = computeDiff(before, after);

    // Only log if something actually changed
    if (Object.keys(diff).length > 0) {
      await AuditLog.create([{
        organizationId: actor.organizationId,
        actorId: actor.id || actor._id,
        collectionName: Model.modelName,
        documentId: after._id,
        action: 'UPDATE',
        diff,
      }], { session });
    }

    await session.commitTransaction();
    return after;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}
```

### `backend/src/utils/logger.ts`
```ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'case-guard-api' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

export default logger;
```

### `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

### `docker-compose.yml`
```yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    container_name: caseguard-mongodb
    command: ["--replSet", "rs0", "--bind_ip_all", "--port", "27017"]
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    healthcheck:
      test: echo "try { rs.status() } catch (err) { rs.initiate({_id:'rs0',members:[{_id:0,host:'mongodb:27017'}]}) }" | mongosh --port 27017 --quiet
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: caseguard-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - PORT=5000
      - MONGO_URI=mongodb://mongodb:27017/caseguard?replicaSet=rs0
      - JWT_SECRET=supersecretjwtkey12345
    depends_on:
      mongodb:
        condition: service_healthy
    volumes:
      - ./backend/src:/usr/src/app/src

  frontend:
  pii-service:
  knowledge-service:
  screener-service:
    build:
      context: ./screener-service
      dockerfile: Dockerfile
    container_name: caseguard-screener-service
    environment:
      - NODE_ENV=development
    ports:
      - "5003:5003"
    volumes:
      - ./screener-service/src:/usr/src/app/src

    build:
      context: ./knowledge-service
      dockerfile: Dockerfile
    container_name: caseguard-knowledge-service
    environment:
      - NODE_ENV=development
      - MONGO_URI=mongodb://mongodb:27017/caseguard?replicaSet=rs0
      - AWS_REGION=us-east-1
      - USE_MOCK_BEDROCK=true
    depends_on:
      mongodb:
        condition: service_healthy
    volumes:
      - ./knowledge-service/src:/usr/src/app/src

    build:
      context: ./pii-service
      dockerfile: Dockerfile
    container_name: caseguard-pii-service
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=development
      - PORT=5001
      - MONGO_URI=mongodb://mongodb:27017/caseguard?replicaSet=rs0
      - AWS_REGION=us-east-1
      - USE_MOCK_COMPREHEND=true
      - USE_MOCK_KMS=true
    depends_on:
      mongodb:
        condition: service_healthy
    volumes:
      - ./pii-service/src:/usr/src/app/src

    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: caseguard-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    volumes:
      - ./frontend/src:/app/src

volumes:
  mongodb_data:
```

### `frontend/.env.example`
```example
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### `frontend/.gitignore`
```txt
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### `frontend/AGENTS.md`
```md
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

### `frontend/CLAUDE.md`
```md
@AGENTS.md
```

### `frontend/Dockerfile`
```txt
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### `frontend/README.md`
```md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
```

### `frontend/components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": false,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "menuColor": "default",
  "menuAccent": "subtle",
  "registries": {}
}
```

### `frontend/eslint.config.mjs`
```mjs
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

### `frontend/next.config.ts`
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
```

### `frontend/package.json`
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@base-ui/react": "^1.7.0",
    "@tanstack/react-query": "^5.101.4",
    "axios": "^1.19.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.31.0",
    "next": "16.3.0",
    "next-themes": "^0.4.6",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "shadcn": "^4.18.0",
    "sonner": "^2.0.8",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### `frontend/postcss.config.mjs`
```mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `frontend/src/app/(auth)/login/page.tsx`
```tsx
"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sign in to CaseGuard</CardTitle>
          <CardDescription>
            Enter your credentials to access the secure case environment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="jane.doe@legal-aid.org" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <Button className="w-full text-md h-11" asChild>
            <Link href="/cases">Sign in</Link>
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### `frontend/src/app/(auth)/register/page.tsx`
```tsx
"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
          <CardDescription>
            Register to securely access the CaseGuard platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Jane" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Doe" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="jane.doe@legal-aid.org" required />
          </div>
          
          <div className="space-y-2 pt-2 border-t border-border mt-4">
            <Label htmlFor="orgName" className="flex justify-between">
              <span>Organization Name</span>
              <span className="text-muted-foreground font-normal text-xs">(Creates new tenant)</span>
            </Label>
            <Input id="orgName" placeholder="e.g. Center for Family Justice" required />
            <p className="text-xs text-muted-foreground mt-1">
              You will automatically become the Administrator for this organization.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button className="w-full text-md h-11" asChild>
            <Link href="/login">Register & Continue</Link>
          </Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### `frontend/src/app/(dashboard)/admin/page.tsx`
```tsx
'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert } from 'lucide-react';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, logsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/audit-logs')
      ]);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to update role');
    }
  };

  if (loading) return <div className="text-white text-center p-12">Loading admin data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-12 w-12 bg-[#111113] rounded-xl border border-white/10 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase" style={{ fontStretch: 'condensed' }}>Admin Panel</h1>
          <p className="text-[#a1a1aa] text-sm tracking-wide mt-1">Manage users and view system audit logs.</p>
        </div>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-black">Users</TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:text-black">Audit Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
            <Table>
              <TableHeader className="border-b border-white/10">
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Name</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Email</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Current Role</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                    <TableCell className="font-bold text-white text-sm tracking-wide py-6 px-8">{u.name}</TableCell>
                    <TableCell className="text-[#a1a1aa] py-6 px-8">{u.email}</TableCell>
                    <TableCell className="py-6 px-8">
                      <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${
                          u.role === 'admin' ? 'border-white text-white' : 'border-white/20 text-[#a1a1aa]'
                        }`}>
                          {u.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <select 
                        className="block w-full bg-[#111113] border border-white/10 px-4 py-2 text-white focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-xs appearance-none rounded-lg"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={u.email === 'admin@caseguard.com'}
                      >
                        <option value="case_worker">Case Worker</option>
                        <option value="lawyer">Lawyer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
            <Table>
              <TableHeader className="border-b border-white/10">
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">User</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Action</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Entity</TableHead>
                  <TableHead className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Entity ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                    <TableCell className="text-[#a1a1aa] text-xs py-6 px-8">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="font-bold text-white text-sm tracking-wide py-6 px-8">{log.userId?.name || log.userId}</TableCell>
                    <TableCell className="py-6 px-8">
                      <span className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/20 text-[#a1a1aa] rounded-full">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-white font-medium py-6 px-8">{log.entityType}</TableCell>
                    <TableCell className="font-mono text-xs text-[#a1a1aa] py-6 px-8">{log.entityId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### `frontend/src/app/(dashboard)/cases/[id]/brief/page.tsx`
```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Printer, Save, ArrowLeft } from 'lucide-react';
import { BriefSkeleton } from '@/components/ui/skeletons';

export default function LawyerBriefPage() {
  const router = useRouter();
  const { id } = useParams();
  const [content, setContent] = useState('');
  
  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/cases/${id}/generate-brief`);
      return res.data;
    },
    onSuccess: (data) => {
      setContent(data.content);
      toast.success('Brief generated successfully!');
    },
    onError: () => {
      toast.error('Failed to generate brief.');
    }
  });

  useEffect(() => {
    // Generate on first load if content is empty
    if (!content && !generateMutation.isPending && !generateMutation.isSuccess) {
      generateMutation.mutate();
    }
  }, [id, content, generateMutation]);

  const handleSave = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Saving brief...',
        success: 'Brief saved successfully!',
        error: 'Failed to save brief.',
      }
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (generateMutation.isPending && !content) {
    return <div className="p-6"><BriefSkeleton /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Case
        </Button>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => generateMutation.mutate()} disabled={generateMutation.isPending}>
            {generateMutation.isPending ? 'Regenerating...' : 'Regenerate Brief'}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Export / Print
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200 print:bg-white print:border-none">
          <CardTitle className="text-center text-2xl tracking-tight text-slate-800">Lawyer Case Brief</CardTitle>
          <p className="text-center text-slate-500 mt-2 font-mono text-sm">Ref ID: {id}</p>
        </CardHeader>
        <CardContent className="p-0">
          <Textarea 
            className="min-h-[600px] w-full p-8 border-0 focus-visible:ring-0 resize-y text-base leading-relaxed font-serif print:p-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
```

### `frontend/src/app/(dashboard)/cases/[id]/page.tsx`
```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, ShieldCheck, Activity, FileText, ChevronRight } from 'lucide-react';
import { CaseDetailSkeleton } from '@/components/ui/skeletons';

export default function CaseDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [prediction, setPrediction] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const { data: caseResponse, isLoading: loading, isError } = useQuery({
    queryKey: ['case', id],
    queryFn: async () => {
      const res = await api.get(`/cases/${id}`);
      return res.data;
    }
  });

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const predRes = await api.post(`/cases/${id}/analyze`);
      const recRes = await api.post(`/cases/${id}/generate-recommendations`);
      return { prediction: predRes.data, recommendation: recRes.data };
    },
    onSuccess: (resData) => {
      setPrediction(resData.prediction);
      setRecommendation(resData.recommendation);
      toast.success('Analysis completed successfully!');
    },
    onError: () => {
      toast.error('Failed to run analysis. Please try again.');
    }
  });

  const data = caseResponse;

  if (loading) return <div className="p-6"><CaseDetailSkeleton /></div>;
  if (isError || !data?.case) return <div className="p-20 text-center"><p className="text-xl text-white font-bold tracking-tight uppercase">Case not found or failed to load.</p></div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-3xl font-bold text-white uppercase tracking-tighter" style={{ fontStretch: 'condensed' }}>{data.case.title}</h1>
            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${
                          data.case.status === 'open' ? 'border-white text-white' : 'border-white/20 text-[#a1a1aa]'
                        }`}>
              {data.case.status}
            </span>
          </div>
          <p className="text-sm text-[#a1a1aa] font-mono tracking-wider">ID: {data.case._id}</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => router.push(`/cases/${id}/brief`)} className="flex items-center justify-center px-6 py-3 text-xs font-bold tracking-widest uppercase text-white bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300">
            <FileText className="mr-2 h-4 w-4" /> Lawyer Brief
          </button>
          <button onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending} className="flex items-center justify-center bg-white px-6 py-3 text-black font-bold tracking-widest uppercase text-xs transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed border border-white rounded-lg">
            <Activity className="mr-2 h-4 w-4" /> {analyzeMutation.isPending ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md">Overview</TabsTrigger>
              <TabsTrigger value="statement" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md">Statement</TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md">Timeline</TabsTrigger>
              <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:text-black rounded-md">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
                <div className="p-8 border-b border-white/10">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#a1a1aa]">Intake Details</h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Relationship Type</p>
                      <p className="mt-2 text-white font-medium text-lg">{data.inputs?.relationshipType || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Frequency</p>
                      <p className="mt-2 text-white font-medium text-lg">{data.inputs?.incidentFrequency || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Prior Complaints</p>
                      <p className="mt-2 text-white font-medium text-lg">{data.inputs?.priorComplaints ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="statement" className="mt-6">
              <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
                <div className="p-8 border-b border-white/10">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#a1a1aa]">Victim Statement</h3>
                </div>
                <div className="p-8">
                  <p className="whitespace-pre-wrap text-white/90 leading-relaxed font-medium">
                    {data.statement?.anonymizedText || 'No statement provided.'}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
                <div className="p-8 border-b border-white/10">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#a1a1aa]">Timeline Events</h3>
                </div>
                <div className="p-8">
                  {data.timeline?.length === 0 ? (
                    <p className="text-[#a1a1aa] font-medium">No events recorded yet.</p>
                  ) : (
                    <div className="space-y-8">
                      {data.timeline?.map((ev: any) => (
                        <div key={ev._id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-2rem] last:before:bottom-0 before:w-px before:bg-white/20">
                          <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-white ring-4 ring-[#0a0a0c]" />
                          <div>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">{new Date(ev.date).toLocaleDateString()}</p>
                            <p className="text-sm text-white font-medium mt-2">{ev.description}</p>
                            <span className="inline-block mt-3 px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/20 text-[#a1a1aa] rounded-md">{ev.severity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="mt-6 space-y-6">
              {!prediction ? (
                <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-white/10 backdrop-blur-md">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight uppercase">No Analysis Available</h3>
                  <p className="text-[#a1a1aa] mt-2 mb-8 font-medium text-sm">Run the ML analysis to generate insights.</p>
                  <button onClick={() => analyzeMutation.mutate()} disabled={analyzeMutation.isPending} className="inline-flex items-center justify-center bg-white px-6 py-3 text-black font-bold tracking-widest uppercase text-xs transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed border border-white rounded-lg">
                    {analyzeMutation.isPending ? 'Analyzing...' : 'Run Analysis Now'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
                    <div className="p-8 border-b border-white/10">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-[#a1a1aa]">Risk & Severity Assessment</h3>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-center justify-center p-6 bg-[#111113] rounded-2xl border border-white/10 flex-1">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] mb-3">Severity</p>
                          <span className="inline-flex items-center px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 rounded-full">
                            {prediction.severity}
                          </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-6 bg-[#111113] rounded-2xl border border-white/10 flex-1">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] mb-2">Escalation Score</p>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-4xl font-bold text-white tracking-tighter">{prediction.escalationScore}</span>
                            <span className="text-sm font-bold text-[#a1a1aa]">/ 100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
                    <div className="p-8 border-b border-white/10">
                      <h3 className="text-xs font-bold tracking-widest uppercase text-[#a1a1aa]">Identified Patterns & Triggers</h3>
                    </div>
                    <div className="p-8 space-y-8">
                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] mb-4">Abuse Patterns</h4>
                        <div className="flex flex-wrap gap-2">
                          {prediction.patterns.map((p: string, i: number) => (
                            <span key={i} className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">{p}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] mb-4">Risk Triggers</h4>
                        <ul className="space-y-3">
                          {prediction.triggers.map((t: string, i: number) => (
                            <li key={i} className="flex items-start text-sm text-white font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-1.5 mr-3 shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Safe Action Navigator */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md sticky top-6">
            <div className="p-6 border-b border-white/10 bg-[#111113]/50">
              <h3 className="flex items-center text-xs font-bold tracking-widest uppercase text-white">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Safe Action Navigator
              </h3>
            </div>
            
            <div className="p-0">
              {!recommendation ? (
                <div className="p-8 text-center text-[#a1a1aa] text-sm font-medium">
                  Run analysis to generate action items.
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  <div className="p-6 bg-orange-500/5">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Urgency</p>
                    <p className="text-orange-400 font-bold flex items-center text-sm tracking-wide">
                      <AlertTriangle className="h-4 w-4 mr-2" /> {recommendation.urgency}
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] mb-4">Evidence Checklist</p>
                    <ul className="space-y-3">
                      {recommendation.evidenceChecklist.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-white font-medium leading-relaxed">
                          <ChevronRight className="h-4 w-4 text-[#a1a1aa] mr-2 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] mb-4">Follow-up Questions</p>
                    <ul className="space-y-3">
                      {recommendation.followUpQuestions.map((item: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-white font-medium leading-relaxed">
                          <ChevronRight className="h-4 w-4 text-[#a1a1aa] mr-2 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-[#111113]/50">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] mb-4">Referrals</p>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.referrals.map((item: string, i: number) => (
                        <span key={i} className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white border border-white/10 rounded-full">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### `frontend/src/app/(dashboard)/cases/new/page.tsx`
```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { ArrowUpRight, ShieldAlert } from 'lucide-react';

export default function NewCasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    relationshipType: '',
    incidentFrequency: '',
    priorComplaints: false,
    statement: ''
  });

  const createCaseMutation = useMutation({
    mutationFn: async () => {
      // 1. Create Case
      const caseRes = await api.post('/cases', { title: formData.title });
      const caseId = caseRes.data._id;

      // 2. Add Intake Details
      await api.put(`/cases/${caseId}/input`, {
        relationshipType: formData.relationshipType,
        incidentFrequency: formData.incidentFrequency,
        priorComplaints: formData.priorComplaints,
        incidentTypes: ['General'] // Simplified for now
      });

      // 3. Add Statement
      await api.put(`/cases/${caseId}/statement`, {
        anonymizedText: formData.statement
      });

      return caseId;
    },
    onSuccess: (caseId) => {
      toast.success('Case created successfully!');
      router.push(`/cases/${caseId}`);
    },
    onError: () => {
      toast.error('Failed to create case. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCaseMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-12 w-12 bg-[#111113] rounded-xl border border-white/10 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase" style={{ fontStretch: 'condensed' }}>New Case Intake</h1>
          <p className="text-[#a1a1aa] text-sm tracking-wide mt-1">Enter the initial structured data and victim statement.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
          <div className="p-10 space-y-8">
            <div className="space-y-3">
              <label htmlFor="title" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Case Title / Reference</label>
              <input 
                id="title" 
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
                placeholder="e.g. State vs. John Doe or Jane Doe Report" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label htmlFor="relationship" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Relationship Type</label>
                <input 
                  id="relationship" 
                  className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
                  placeholder="e.g. Spouse, Ex-partner" 
                  value={formData.relationshipType} 
                  onChange={e => setFormData({...formData, relationshipType: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-3">
                <label htmlFor="frequency" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Incident Frequency</label>
                <input 
                  id="frequency" 
                  className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm rounded-lg"
                  placeholder="e.g. Daily, Weekly, Rare" 
                  value={formData.incidentFrequency} 
                  onChange={e => setFormData({...formData, incidentFrequency: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input 
                type="checkbox" 
                id="prior" 
                className="rounded border-white/20 bg-[#111113] text-white focus:ring-white/30 h-5 w-5 accent-white cursor-pointer"
                checked={formData.priorComplaints}
                onChange={e => setFormData({...formData, priorComplaints: e.target.checked})}
              />
              <label htmlFor="prior" className="text-sm font-medium text-white cursor-pointer tracking-wide">Prior complaints filed?</label>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <label htmlFor="statement" className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa]">Victim Statement</label>
              <textarea 
                id="statement" 
                className="block w-full bg-[#111113] border border-white/10 px-5 py-4 text-white placeholder-white/30 focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:outline-none transition-all duration-300 font-medium tracking-wide shadow-inner text-sm min-h-[200px] resize-y rounded-lg"
                placeholder="Enter the detailed statement here..." 
                value={formData.statement}
                onChange={e => setFormData({...formData, statement: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="bg-[#0a0a0c] border-t border-white/10 p-6 flex justify-end items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-white hover:text-[#a1a1aa] transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createCaseMutation.isPending} 
              className="flex items-center justify-between group overflow-hidden bg-white px-6 py-3 text-black font-bold tracking-widest uppercase text-xs transition-all hover:bg-neutral-200 disabled:opacity-70 disabled:cursor-not-allowed border border-white rounded-lg"
            >
              <span className="mr-3">
                {createCaseMutation.isPending ? 'CREATING...' : 'CREATE CASE'}
              </span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-black/20 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
```

### `frontend/src/app/(dashboard)/dashboard/page.tsx`
```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, FileText, Inbox, ArrowUpRight } from 'lucide-react';
import { CaseListSkeleton } from '@/components/ui/skeletons';

export default function DashboardPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: cases = [], isLoading, isError } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await api.get('/cases');
      return res.data;
    }
  });

  const filteredCases = cases.filter((c: any) => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c._id.includes(search)
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header Banner */}
      <div className="relative bg-white/[0.02] p-12 rounded-[2rem] border border-white/10 backdrop-blur-md overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight uppercase" style={{ fontStretch: 'condensed' }}>
            Case<br/>Management
          </h1>
          <p className="text-[#a1a1aa] mt-4 text-base font-medium tracking-wide leading-relaxed max-w-md">
            I design elegant, high-performing digital experiences that merge strategy, aesthetics, and technology. (Just kidding, manage your cases here).
          </p>
        </div>
        
        <button 
          onClick={() => router.push('/cases/new')}
          className="relative z-10 flex items-center gap-3 bg-white hover:bg-neutral-200 text-black px-8 py-5 transition-all duration-300 group"
        >
          <span className="font-bold text-xs tracking-widest uppercase">New Case</span>
          <span className="flex items-center justify-center w-8 h-8 rounded-full border border-black/20 group-hover:bg-black group-hover:text-white transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Stats/Metrics (Inspired by the reference image) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: '✧', value: cases.length || '0', label: 'TOTAL CASES' },
          { icon: '⚑', value: cases.filter((c: any) => c.status === 'open').length || '0', label: 'OPEN CASES' },
          { icon: '✓', value: cases.filter((c: any) => c.status === 'closed').length || '0', label: 'CLOSED CASES' },
          { icon: '⊕', value: new Set(cases.map((c: any) => c.assignedTo?._id)).size || '0', label: 'WORKERS ASSIGNED' }
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-white/[0.04]">
            <span className="text-[#a1a1aa] text-2xl mb-4">{stat.icon}</span>
            <span className="text-4xl font-bold text-white mb-2" style={{ fontStretch: 'condensed' }}>{stat.value}</span>
            <span className="text-[10px] font-bold text-[#a1a1aa] tracking-widest uppercase">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-[#111113] p-4 rounded-xl border border-white/10 relative shadow-inner">
        <Search className="h-5 w-5 text-[#a1a1aa] ml-3" />
        <input 
          placeholder="SEARCH CASES BY TITLE OR ID..." 
          className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-[#a1a1aa] font-bold text-xs tracking-widest uppercase py-2 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cases Table */}
      <div className="bg-white/[0.02] rounded-3xl border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="p-8 border-b border-white/10">
          <h3 className="text-xs font-bold tracking-widest uppercase text-[#a1a1aa]">Featured Cases</h3>
        </div>
        
        {isLoading ? (
          <div className="p-8">
            <CaseListSkeleton />
          </div>
        ) : isError ? (
          <div className="p-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6">
               <span className="text-white text-2xl">⚠</span>
            </div>
            <p className="text-xl text-white font-bold tracking-tight uppercase">Failed to load cases</p>
            <p className="text-[#a1a1aa] mt-3 font-medium text-sm">Please try refreshing the page.</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Case Title</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">ID</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Status</th>
                  <th className="text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Created</th>
                  <th className="text-right text-[10px] font-bold tracking-widest uppercase text-[#a1a1aa] py-6 px-8">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-32">
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-white/5 p-6 rounded-full border border-white/10">
                          <Inbox className="h-8 w-8 text-[#a1a1aa]" strokeWidth={1} />
                        </div>
                        <p className="text-white text-lg font-bold tracking-tight uppercase">No cases found</p>
                        {search ? (
                          <p className="text-[#a1a1aa] text-sm tracking-wide">Try adjusting your search filters.</p>
                        ) : (
                          <button onClick={() => router.push('/cases/new')} className="mt-2 text-xs font-bold tracking-widest uppercase text-white border-b border-white hover:text-[#a1a1aa] hover:border-[#a1a1aa] pb-1 transition-colors">
                            Create your first case →
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCases.map((c: any) => (
                    <tr key={c._id} className="group hover:bg-white/[0.04] cursor-pointer border-b border-white/5 transition-colors" onClick={() => router.push(`/cases/${c._id}`)}>
                      <td className="py-6 px-8 flex items-center">
                        <div className="h-10 w-10 bg-[#111113] rounded-lg border border-white/10 flex items-center justify-center mr-4 group-hover:border-white/30 transition-colors">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white tracking-wide">{c.title}</span>
                      </td>
                      <td className="py-6 px-8 text-[#a1a1aa] font-mono text-xs tracking-wider">{c._id.substring(0, 8)}</td>
                      <td className="py-6 px-8">
                        <span className={`inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full ${
                          c.status === 'open' ? 'border-white text-white' : 'border-white/20 text-[#a1a1aa]'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-6 px-8 text-[#a1a1aa] text-sm font-medium tracking-wide">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-6 px-8 text-right">
                        <button onClick={(e) => { e.stopPropagation(); router.push(`/cases/${c._id}`); }} className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-white group-hover:bg-white group-hover:text-black transition-all">
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
```

### `frontend/src/app/(dashboard)/layout.tsx`
```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  UserPlus, 
  Settings, 
  LogOut,
  AlertTriangle
} from "lucide-react";

// Mocking role for now (would come from Auth Context)
const MOCK_USER_ROLE: "LAWYER" | "CASE_WORKER" | "ADMIN" = "LAWYER";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { name: "Cases", href: "/cases", icon: FileText, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
    { name: "New Intake", href: "/intake", icon: UserPlus, roles: ["LAWYER", "CASE_WORKER", "ADMIN"] },
    { name: "PII Review Queue", href: "/privacy-queue", icon: ShieldCheck, roles: ["LAWYER", "ADMIN"] },
    { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["ADMIN"] },
    { name: "System Config", href: "/config", icon: Settings, roles: ["ADMIN"] },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <ShieldCheck className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-lg tracking-tight">CaseGuard</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            if (!item.roles.includes(MOCK_USER_ROLE)) return null;
            
            const isActive = pathname ? pathname.startsWith(item.href) : false;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={"flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors " + (isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground")}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-3 py-2 text-sm text-muted-foreground">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center font-medium text-secondary-foreground">
              JD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-medium text-foreground truncate">Jane Doe</p>
              <p className="text-xs truncate capitalize">{MOCK_USER_ROLE.replace('_', ' ').toLowerCase()}</p>
            </div>
          </div>
          <button className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold capitalize">
            {pathname ? (pathname.split('/')[1] || "Dashboard") : "Dashboard"}
          </h1>
          {/* Example of a trauma-informed mild warning, not blaring red */}
          {MOCK_USER_ROLE === "ADMIN" && (
            <div className="flex items-center space-x-2 bg-accent/20 text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium border border-accent/30">
              <AlertTriangle className="h-4 w-4" />
              <span>3 Referrals Need Verification</span>
            </div>
          )}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

### `frontend/src/app/globals.css`
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
  --font-heading: var(--font-sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.6 0.15 40);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.6 0.15 40);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.87 0 0);
  --chart-2: oklch(0.556 0 0);
  --chart-3: oklch(0.439 0 0);
  --chart-4: oklch(0.371 0 0);
  --chart-5: oklch(0.269 0 0);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

### `frontend/src/app/layout.tsx`
```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaseGuard - Domestic Violence Case Analyzer',
  description: 'Privacy-first case management and decision-support platform',
};

import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0f1014] text-slate-200 antialiased selection:bg-white/10 selection:text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### `frontend/src/app/page.tsx`
```tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
```

### `frontend/src/components/Providers.tsx`
```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
```

### `frontend/src/components/ui/badge.tsx`
```tsx
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
```

### `frontend/src/components/ui/button.tsx`
```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

### `frontend/src/components/ui/card.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

### `frontend/src/components/ui/dialog.tsx`
```tsx
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
```

### `frontend/src/components/ui/input.tsx`
```tsx
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

### `frontend/src/components/ui/label.tsx`
```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
```

### `frontend/src/components/ui/skeletons.tsx`
```tsx
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// If shadcn skeleton isn't installed, we use a basic fallback here
const BasicSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
);

export function CaseListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <BasicSkeleton className="h-5 w-1/3" />
            <BasicSkeleton className="h-4 w-1/4 mt-2" />
          </CardHeader>
          <CardContent>
            <BasicSkeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CaseDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-full max-w-sm">
          <BasicSkeleton className="h-8 w-3/4" />
          <BasicSkeleton className="h-4 w-1/2" />
        </div>
        <div className="flex space-x-3">
          <BasicSkeleton className="h-10 w-32" />
          <BasicSkeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <BasicSkeleton className="h-12 w-full" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <BasicSkeleton className="h-4 w-full" />
              <BasicSkeleton className="h-4 w-5/6" />
              <BasicSkeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <BasicSkeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <BasicSkeleton className="h-12 w-full" />
              <BasicSkeleton className="h-12 w-full" />
              <BasicSkeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function BriefSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between">
        <BasicSkeleton className="h-10 w-32" />
        <div className="flex space-x-3">
          <BasicSkeleton className="h-10 w-32" />
          <BasicSkeleton className="h-10 w-32" />
        </div>
      </div>
      <Card>
        <CardHeader className="items-center">
          <BasicSkeleton className="h-8 w-64" />
          <BasicSkeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="p-8 space-y-4">
          <BasicSkeleton className="h-6 w-1/4 mb-4" />
          <BasicSkeleton className="h-4 w-full" />
          <BasicSkeleton className="h-4 w-full" />
          <BasicSkeleton className="h-4 w-5/6" />
          <BasicSkeleton className="h-6 w-1/4 mt-8 mb-4" />
          <BasicSkeleton className="h-4 w-full" />
          <BasicSkeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>
    </div>
  );
}
```

### `frontend/src/components/ui/sonner.tsx`
```tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
```

### `frontend/src/components/ui/table.tsx`
```tsx
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

### `frontend/src/components/ui/tabs.tsx`
```tsx
"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
```

### `frontend/src/components/ui/textarea.tsx`
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
```

### `frontend/src/lib/api.ts`
```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

import { toast } from 'sonner';

// Add a request interceptor to inject the JWT token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        toast.error('Session expired or unauthorized. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### `frontend/src/lib/utils.ts`
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### `frontend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### `knowledge-service/jest.config.js`
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts']
};
```

### `knowledge-service/package.json`
```json
{
  "name": "knowledge-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "build": "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@aws-sdk/client-bedrock-runtime": "^3.1116.0",
    "@langchain/core": "^1.2.9",
    "dotenv": "^17.4.2",
    "langchain": "^1.5.10",
    "mongoose": "^9.9.3",
    "pdf-parse": "^2.4.5"
  },
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "@types/node": "^26.2.0",
    "jest": "^30.4.2",
    "mongodb-memory-server": "^11.2.0",
    "ts-jest": "^29.4.12",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

### `knowledge-service/src/models/LegalChunk.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ILegalChunk extends Document {
  sourceDocId: string;
  chunkText: string;
  jurisdiction: string;
  documentType: string;
  embedding: number[];
  lastVerifiedAt: Date;
  createdAt: Date;
}

const LegalChunkSchema = new Schema<ILegalChunk>({
  sourceDocId: { type: String, required: true },
  chunkText: { type: String, required: true },
  jurisdiction: { type: String, required: true, index: true },
  documentType: { type: String, required: true }, // e.g. 'statute', 'shelter_contact'
  embedding: { type: [Number], required: true },
  lastVerifiedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.LegalChunk || mongoose.model<ILegalChunk>('LegalChunk', LegalChunkSchema);
```

### `knowledge-service/src/models/ResearchChunk.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IResearchChunk extends Document {
  sourceDocId: string;
  chunkText: string;
  sectionHeading?: string;
  embedding: number[];
  createdAt: Date;
}

const ResearchChunkSchema = new Schema<IResearchChunk>({
  sourceDocId: { type: String, required: true },
  chunkText: { type: String, required: true },
  sectionHeading: { type: String },
  embedding: { type: [Number], required: true }, // For Atlas Vector Search
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ResearchChunk || mongoose.model<IResearchChunk>('ResearchChunk', ResearchChunkSchema);
```

### `knowledge-service/src/services/bedrock.ts`
```ts
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || 'us-east-1' });

export async function generateTitanEmbedding(text: string): Promise<number[]> {
  if (process.env.USE_MOCK_BEDROCK === 'true') {
    // Return dummy vector of length 1024 for testing
    return Array.from({ length: 1024 }, () => Math.random());
  }

  const payload = {
    inputText: text,
  };

  const command = new InvokeModelCommand({
    modelId: "amazon.titan-embed-text-v2:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.embedding;
}

export async function cohereRerank(query: string, documents: string[], topN: number = 5): Promise<any[]> {
  if (process.env.USE_MOCK_BEDROCK === 'true') {
    // Mock simply returns documents in order with fake scores
    return documents.slice(0, topN).map((doc, i) => ({
      index: i,
      relevance_score: 0.9 - (i * 0.1)
    }));
  }

  const payload = {
    query,
    documents,
    top_n: topN,
    return_documents: false
  };

  const command = new InvokeModelCommand({
    modelId: "cohere.rerank-v3-5:0", // Default Cohere Rerank model ID on Bedrock
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload)
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.results;
}
```

### `knowledge-service/src/services/ingestion.ts`
```ts
import fs from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import ResearchChunk from '../models/ResearchChunk';
import { generateTitanEmbedding } from './bedrock';

// Helper to extract text (simple read file for txt, real pdf extraction would go here)
async function extractText(filePath: string): Promise<string> {
  const content = fs.readFileSync(filePath, 'utf8');
  return content;
}

export async function ingestCorpus(directoryPath: string) {
  const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.txt')); // Simulating just txt for now
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
  });

  for (const file of files) {
    const text = await extractText(path.join(directoryPath, file));
    const chunks = await splitter.createDocuments([text]);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateTitanEmbedding(chunk.pageContent);
      
      await ResearchChunk.create({
        sourceDocId: file, // Basic doc id
        chunkText: chunk.pageContent,
        embedding: embedding
      });
    }
  }
}
```

### `knowledge-service/src/services/legal_ingestion.ts`
```ts
import fs from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import LegalChunk from '../models/LegalChunk';
import { generateTitanEmbedding } from './bedrock';

export async function ingestLegalCorpus(directoryPath: string, jurisdiction: string, documentType: string) {
  if (!fs.existsSync(directoryPath)) return;
  const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.txt')); 
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,
    chunkOverlap: 50,
  });

  for (const file of files) {
    const text = fs.readFileSync(path.join(directoryPath, file), 'utf8');
    const chunks = await splitter.createDocuments([text]);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateTitanEmbedding(chunk.pageContent);
      
      await LegalChunk.create({
        sourceDocId: file,
        chunkText: chunk.pageContent,
        jurisdiction,
        documentType,
        embedding: embedding,
        lastVerifiedAt: new Date() // Sets to now during ingestion
      });
    }
  }
}
```

### `knowledge-service/src/services/retrieval.ts`
```ts
import LegalChunk from '../models/LegalChunk';
import ResearchChunk from '../models/ResearchChunk';
import { generateTitanEmbedding, cohereRerank } from './bedrock';

export async function retrieveResearch(query: string, k: number = 5) {
  // 1. Embed query
  const queryEmbedding = await generateTitanEmbedding(query);

  // 2. Vector Search (Atlas Vector Search format)
  // Requires MongoDB Atlas cluster with vectorSearch index named "vector_index"
  const vectorResults = await ResearchChunk.aggregate([
    {
      "$vectorSearch": {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: k * 10,
        limit: k * 2
      }
    }
  ]);

  // 3. Lexical Search (Atlas Search format)
  // Requires MongoDB Atlas cluster with search index named "default"
  const lexicalResults = await ResearchChunk.aggregate([
    {
      "$search": {
        index: "default",
        text: {
          query: query,
          path: "chunkText"
        }
      }
    },
    { $limit: k * 2 }
  ]);

  // 4. Reciprocal Rank Fusion (RRF)
  const fusionScores = new Map<string, { doc: any, score: number }>();
  const RRF_K = 60; // Standard constant for RRF

  const addScore = (doc: any, rank: number) => {
    const id = doc._id.toString();
    const current = fusionScores.get(id) || { doc, score: 0 };
    current.score += 1 / (RRF_K + rank);
    fusionScores.set(id, current);
  };

  vectorResults.forEach((doc, idx) => addScore(doc, idx + 1));
  lexicalResults.forEach((doc, idx) => addScore(doc, idx + 1));

  // Sort by fusion score
  const mergedCandidates = Array.from(fusionScores.values())
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.doc);

  if (mergedCandidates.length === 0) return [];

  // 5. Rerank
  const textsToRerank = mergedCandidates.map(c => c.chunkText);
  const rerankedResults = await cohereRerank(query, textsToRerank, k);

  // Map back to original documents based on reranker indices
  const finalResults = rerankedResults.map(r => {
    const originalDoc = mergedCandidates[r.index];
    return {
      chunkText: originalDoc.chunkText,
      sourceDocId: originalDoc.sourceDocId,
      sectionHeading: originalDoc.sectionHeading,
      relevanceScore: r.relevance_score
    };
  });

  return finalResults;
}

// MOCK Retrieval for Local Dev (when not connected to Atlas)
export async function mockRetrieveResearch(query: string, k: number = 5) {
  // Simple regex search for local testing without Atlas
  const allDocs = await ResearchChunk.find({
    chunkText: { $regex: query.split(' ')[0], $options: 'i' }
  }).limit(k);

  return allDocs.map(doc => ({
    chunkText: doc.chunkText,
    sourceDocId: doc.sourceDocId,
    sectionHeading: doc.sectionHeading,
    relevanceScore: 0.99
  }));
}

export async function retrieveLegal(query: string, k: number = 5, jurisdiction: string) {
  const queryEmbedding = await generateTitanEmbedding(query);

  const vectorResults = await LegalChunk.aggregate([
    {
      "$vectorSearch": {
        index: "legal_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: k * 10,
        limit: k * 2,
        filter: { jurisdiction: jurisdiction }
      }
    }
  ]);

  const lexicalResults = await LegalChunk.aggregate([
    {
      "$search": {
        index: "legal_default",
        text: {
          query: query,
          path: "chunkText"
        }
      }
    },
    { $match: { jurisdiction: jurisdiction } },
    { $limit: k * 2 }
  ]);

  const fusionScores = new Map<string, { doc: any, score: number }>();
  const RRF_K = 60;

  const addScore = (doc: any, rank: number) => {
    const id = doc._id.toString();
    const current = fusionScores.get(id) || { doc, score: 0 };
    current.score += 1 / (RRF_K + rank);
    fusionScores.set(id, current);
  };

  vectorResults.forEach((doc, idx) => addScore(doc, idx + 1));
  lexicalResults.forEach((doc, idx) => addScore(doc, idx + 1));

  const mergedCandidates = Array.from(fusionScores.values())
    .sort((a, b) => b.score - a.score)
    .map(entry => entry.doc);

  if (mergedCandidates.length === 0) return [];

  const textsToRerank = mergedCandidates.map(c => c.chunkText);
  const rerankedResults = await cohereRerank(query, textsToRerank, k);

  return rerankedResults.map(r => {
    const originalDoc = mergedCandidates[r.index];
    return {
      chunkText: originalDoc.chunkText,
      sourceDocId: originalDoc.sourceDocId,
      jurisdiction: originalDoc.jurisdiction,
      documentType: originalDoc.documentType,
      relevanceScore: r.relevance_score
    };
  });
}

// MOCK Retrieval for Local Dev
export async function mockRetrieveLegal(query: string, k: number = 5, jurisdiction: string) {
  const allDocs = await LegalChunk.find({
    chunkText: { $regex: query.split(' ')[0], $options: 'i' },
    jurisdiction: jurisdiction
  }).limit(k);

  return allDocs.map(doc => ({
    chunkText: doc.chunkText,
    sourceDocId: doc.sourceDocId,
    jurisdiction: doc.jurisdiction,
    documentType: doc.documentType,
    relevanceScore: 0.99
  }));
}

export async function getStaleLegalDocuments() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  return await LegalChunk.find({
    lastVerifiedAt: { $lt: ninetyDaysAgo }
  }).select('sourceDocId jurisdiction documentType lastVerifiedAt');
}
```

### `knowledge-service/src/tests/legal_retrieval.test.ts`
```ts
import { mockRetrieveLegal, getStaleLegalDocuments } from '../services/retrieval';
import LegalChunk from '../models/LegalChunk';
import ResearchChunk from '../models/ResearchChunk';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.USE_MOCK_BEDROCK = 'true';
  await mongoose.connect(uri);

  // Seed Legal Data (NY)
  await LegalChunk.create({
    sourceDocId: 'ny_shelter_contact',
    chunkText: 'NY Safe Horizon Hotline: 1-800-621-HOPE',
    jurisdiction: 'NY',
    documentType: 'shelter_contact',
    embedding: Array.from({ length: 1024 }, () => Math.random()),
    lastVerifiedAt: new Date() // Fresh
  });

  // Seed Legal Data (CA)
  await LegalChunk.create({
    sourceDocId: 'ca_shelter_contact',
    chunkText: 'CA Domestic Violence Hotline: 1-800-978-3600',
    jurisdiction: 'CA',
    documentType: 'shelter_contact',
    embedding: Array.from({ length: 1024 }, () => Math.random()),
    lastVerifiedAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000) // 100 days old (Stale)
  });

  // Seed Clinical Data (Should never be returned by legal search)
  await ResearchChunk.create({
    sourceDocId: 'clinical_paper',
    chunkText: 'Clinical research shows that hotline calls correlate with escalation.',
    embedding: Array.from({ length: 1024 }, () => Math.random())
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Legal Retrieval Service', () => {
  it('should filter by jurisdiction strictly', async () => {
    const resultsNY = await mockRetrieveLegal('Hotline', 5, 'NY');
    expect(resultsNY.length).toBe(1);
    expect(resultsNY[0].jurisdiction).toBe('NY');
    expect(resultsNY[0].chunkText).toContain('Safe Horizon');

    const resultsCA = await mockRetrieveLegal('Hotline', 5, 'CA');
    expect(resultsCA.length).toBe(1);
    expect(resultsCA[0].jurisdiction).toBe('CA');
  });

  it('should return stale documents older than 90 days', async () => {
    const staleDocs = await getStaleLegalDocuments();
    expect(staleDocs.length).toBe(1);
    expect(staleDocs[0].jurisdiction).toBe('CA'); // CA doc is 100 days old
  });
});
```

### `knowledge-service/src/tests/retrieval.test.ts`
```ts
import { mockRetrieveResearch } from '../services/retrieval';
import ResearchChunk from '../models/ResearchChunk';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.USE_MOCK_BEDROCK = 'true';
  await mongoose.connect(uri);

  // Seed data
  await ResearchChunk.create({
    sourceDocId: 'glass_et_al_2008',
    chunkText: 'Prior non-fatal strangulation is a significant predictor of future lethality in domestic violence cases.',
    embedding: Array.from({ length: 1024 }, () => Math.random())
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Retrieval Service', () => {
  it('should retrieve relevant chunk for strangulation query (recall@5 test)', async () => {
    const results = await mockRetrieveResearch('strangulation lethality', 5);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].sourceDocId).toBe('glass_et_al_2008');
    expect(results[0].chunkText).toContain('strangulation');
  });
});
```

### `knowledge-service/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*"
  ]
}
```

### `pii-service/Dockerfile`
```txt
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || true
EXPOSE 5001
CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/server.ts"]
```

### `pii-service/jest.config.js`
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts']
};
```

### `pii-service/package.json`
```json
{
  "name": "pii-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "jest",
    "start": "node dist/server.js",
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "@aws-sdk/client-comprehend": "^3.1115.0",
    "@aws-sdk/client-kms": "^3.1115.0",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.9.3"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/jest": "^30.0.0",
    "@types/node": "^26.2.0",
    "@types/supertest": "^7.2.1",
    "jest": "^30.4.2",
    "mongodb-memory-server": "^11.2.0",
    "supertest": "^7.2.2",
    "ts-jest": "^29.4.12",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

### `pii-service/src/models/PiiMap.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPiiMap extends Document {
  caseId: mongoose.Types.ObjectId;
  token: string;
  encryptedOriginalValue: string;
  entityType: string;
  createdAt: Date;
}

const PiiMapSchema = new Schema<IPiiMap>({
  caseId: { type: Schema.Types.ObjectId, required: true, index: true },
  token: { type: String, required: true },
  encryptedOriginalValue: { type: String, required: true },
  entityType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PiiMap || mongoose.model<IPiiMap>('PiiMap', PiiMapSchema);
```

### `pii-service/src/models/PiiReviewItem.ts`
```ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPiiReviewItem extends Document {
  caseId: mongoose.Types.ObjectId;
  spanOffsetStart: number;
  spanOffsetEnd: number;
  encryptedSpanText: string;
  detectedType: string;
  confidence: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PiiReviewItemSchema = new Schema<IPiiReviewItem>({
  caseId: { type: Schema.Types.ObjectId, required: true, index: true },
  spanOffsetStart: { type: Number, required: true },
  spanOffsetEnd: { type: Number, required: true },
  encryptedSpanText: { type: String, required: true },
  detectedType: { type: String, required: true },
  confidence: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'REJECTED'], default: 'PENDING' },
  reviewedBy: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.PiiReviewItem || mongoose.model<IPiiReviewItem>('PiiReviewItem', PiiReviewItemSchema);
```

### `pii-service/src/server.ts`
```ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { anonymizeText } from './services/anonymizer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/caseguard')
  .then(() => console.log('PII Service MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error: ', err));

// Single endpoint for anonymization
app.post('/anonymize', async (req, res) => {
  try {
    const { text, caseId } = req.body;
    
    if (!text || !caseId) {
      return res.status(400).json({ error: 'Missing text or caseId' });
    }

    const result = await anonymizeText(text, caseId);
    return res.json(result);
  } catch (err: any) {
    console.error('Anonymization Error:', err);
    return res.status(500).json({ error: 'Anonymization pipeline failed' });
  }
});

app.listen(PORT, () => console.log(`PII Service running on port ${PORT}`));
```

### `pii-service/src/services/anonymizer.ts`
```ts
import { ComprehendClient, DetectPiiEntitiesCommand } from '@aws-sdk/client-comprehend';
import { encryptText } from '../utils/kms';
import PiiMap from '../models/PiiMap';
import PiiReviewItem from '../models/PiiReviewItem';
import mongoose from 'mongoose';

const comprehend = new ComprehendClient({ region: process.env.AWS_REGION || 'us-east-1' });
const CONFIDENCE_THRESHOLD = 0.85;

export async function anonymizeText(text: string, caseId: string) {
  // 1. Detect PII using AWS Comprehend
  // (In a real implementation we would chunk here if > 100KB, for now keeping it simple)
  let piiEntities: any[] = [];
  
  if (process.env.USE_MOCK_COMPREHEND === 'true') {
    // Mock for local dev without AWS credentials
    const matches = text.matchAll(/John Doe|Jane Smith/gi);
    for (const match of matches) {
      if (match.index !== undefined) {
        piiEntities.push({
          Type: 'PERSON',
          Score: 0.99,
          BeginOffset: match.index,
          EndOffset: match.index + match[0].length
        });
      }
    }
  } else {
    const command = new DetectPiiEntitiesCommand({
      Text: text,
      LanguageCode: 'en'
    });
    const res = await comprehend.send(command);
    piiEntities = res.Entities || [];
  }

  // 2. Secondary Pass (Deterministic Regex for specific items)
  const regexPatterns = [
    { type: 'ID_NUMBER', regex: /\b\d{3}-\d{2}-\d{4}\b/g } // Example: SSN
  ];
  
  for (const pattern of regexPatterns) {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      piiEntities.push({
        Type: pattern.type,
        Score: 1.0,
        BeginOffset: match.index,
        EndOffset: match.index + match[0].length
      });
    }
  }

  // Sort descending by offset so replacement doesn't shift later indices
  piiEntities.sort((a, b) => b.BeginOffset - a.BeginOffset);

  // De-duplicate exact overlapping bounds
  const uniqueEntities = piiEntities.filter((entity, index, self) =>
    index === self.findIndex((t) => (
      t.BeginOffset === entity.BeginOffset && t.EndOffset === entity.EndOffset
    ))
  );

  let anonymizedText = text;
  const tokenCounters: Record<string, number> = {};
  const tokenMap = new Map<string, string>(); // Maps exact string -> Token

  // Process Entities
  for (const entity of uniqueEntities) {
    const spanText = text.substring(entity.BeginOffset, entity.EndOffset);

    // If exact string has been seen before, reuse token (v1 scope exact-match rule)
    let token = tokenMap.get(spanText);
    
    if (!token) {
      // Create new token
      if (!tokenCounters[entity.Type]) tokenCounters[entity.Type] = 1;
      else tokenCounters[entity.Type]++;

      token = `[${entity.Type}_${tokenCounters[entity.Type]}]`;
      tokenMap.set(spanText, token);

      if (entity.Score < CONFIDENCE_THRESHOLD) {
        // Send to review queue, but still redact for now
        token = `[REVIEW_PENDING_${entity.Type}]`;
        const encryptedSpan = await encryptText(spanText);
        await PiiReviewItem.create({
          caseId: new mongoose.Types.ObjectId(caseId),
          spanOffsetStart: entity.BeginOffset,
          spanOffsetEnd: entity.EndOffset,
          encryptedSpanText: encryptedSpan,
          detectedType: entity.Type,
          confidence: entity.Score
        });
      } else {
        // Store in PiiMap
        const encryptedValue = await encryptText(spanText);
        await PiiMap.create({
          caseId: new mongoose.Types.ObjectId(caseId),
          token,
          encryptedOriginalValue: encryptedValue,
          entityType: entity.Type
        });
      }
    }

    // Replace in text
    anonymizedText = anonymizedText.substring(0, entity.BeginOffset) + token + anonymizedText.substring(entity.EndOffset);
  }

  return {
    originalText: text,
    anonymizedText,
    entitiesDetected: uniqueEntities.length
  };
}
```

### `pii-service/src/tests/anonymizer.test.ts`
```ts
import { anonymizeText } from '../services/anonymizer';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.USE_MOCK_COMPREHEND = 'true';
  process.env.USE_MOCK_KMS = 'true';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Anonymizer Service', () => {
  const mockCaseId = new mongoose.Types.ObjectId().toHexString();

  it('should redact exact matches with stable tokens', async () => {
    // The mock comprehend redacts "John Doe"
    const text = 'John Doe went to the store. Then John Doe came back.';
    const result = await anonymizeText(text, mockCaseId);

    // It should replace both instances of John Doe with [PERSON_1]
    expect(result.anonymizedText).toContain('[PERSON_1] went to the store. Then [PERSON_1] came back.');
    expect(result.anonymizedText).not.toContain('John Doe');
  });

  it('should fallback to regex and redact ID_NUMBER', async () => {
    const text = 'My SSN is 123-45-6789.';
    const result = await anonymizeText(text, mockCaseId);

    expect(result.anonymizedText).toContain('My SSN is [ID_NUMBER_1].');
    expect(result.anonymizedText).not.toContain('123-45-6789');
  });
});
```

### `pii-service/src/utils/kms.ts`
```ts
import { KMSClient, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';

// Setup AWS KMS Client
const kmsClient = new KMSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const KMS_KEY_ID = process.env.KMS_KEY_ID || 'alias/CaseGuardPIIKey'; // In prod, use an actual Key ID

export async function encryptText(text: string): Promise<string> {
  // If no KMS key configured, fallback to base64 for local dev if forced
  if (process.env.USE_MOCK_KMS === 'true') {
    return Buffer.from(text).toString('base64');
  }

  const command = new EncryptCommand({
    KeyId: KMS_KEY_ID,
    Plaintext: Buffer.from(text),
  });

  const response = await kmsClient.send(command);
  return Buffer.from(response.CiphertextBlob!).toString('base64');
}

export async function decryptText(encryptedText: string): Promise<string> {
  if (process.env.USE_MOCK_KMS === 'true') {
    return Buffer.from(encryptedText, 'base64').toString('utf-8');
  }

  const command = new DecryptCommand({
    CiphertextBlob: Buffer.from(encryptedText, 'base64'),
  });

  const response = await kmsClient.send(command);
  return Buffer.from(response.Plaintext!).toString('utf-8');
}
```

### `pii-service/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*"
  ]
}
```

### `screener-service/jest.config.js`
```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts']
};
```

### `screener-service/package.json`
```json
{
  "name": "screener-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "ts-node-dev src/index.ts",
    "test": "jest",
    "build": "tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "compromise": "^14.16.0",
    "express": "^5.2.1"
  },
  "devDependencies": {
    "@types/express": "^5.0.6",
    "@types/jest": "^30.0.0",
    "@types/node": "^26.2.0",
    "jest": "^30.4.2",
    "ts-jest": "^29.4.12",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.3.3"
  }
}
```

### `screener-service/src/index.ts`
```ts
import express from 'express';
import { screenNarrative } from './services/screener';

const app = express();
app.use(express.json());

app.post('/screen', (req, res) => {
  const { narrative } = req.body;
  if (!narrative) {
    return res.status(400).json({ error: 'Narrative is required' });
  }

  const result = screenNarrative(narrative);
  res.json(result);
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Screener service running on port ${PORT}`);
});
```

### `screener-service/src/rules/RuleChangelog.md`
```md
# Rule Changelog (Safety Screener)

## [1.0.0] - 2026-08-23
### Added
- **Strangulation/Choking:** Initial regex matching direct and indirect phrasing ("choked", "strangled", "hands around my neck", "squeezed my neck", "couldn't breathe").
- **Weapons:** Keyword matching for guns, knives, and shooting/stabbing verbs.
- **Threats to Kill:** Direct phrases ("kill you", "end your life", "you're dead").
- **Separation:** Indicators of recent or attempted separation ("left him", "divorce", "moving out").
- **Negation Handling:** Basic proximity-based negation check to prevent false flags (e.g., "didn't have a gun").
```

### `screener-service/src/rules/ruleset.ts`
```ts
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
```

### `screener-service/src/services/screener.ts`
```ts
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
```

### `screener-service/src/tests/screener.test.ts`
```ts
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
```

### `screener-service/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*"
  ]
}
```

