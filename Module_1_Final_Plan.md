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
