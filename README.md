# CaseGuard — AI-Powered Legal-Tech Platform

A privacy-first, AI-powered platform for managing legal complaints, automating PII redaction, generating legal briefs, and providing intelligent assistance to complainants and advocates.

---

## 🏗️ Architecture Overview

```
CaseGuard/
├── frontend/           # React + TypeScript + Vite
│   └── src/
│       ├── components/ # UI Components (Dashboard, CaseDetails, LegalBrief, LegalAssistantBot, etc.)
│       ├── contexts/   # AuthContext (JWT + RBAC)
│       ├── services/   # API service layer
│       └── types/      # TypeScript type definitions
│
└── backend/            # Node.js + Express.js
    └── src/
        ├── models/     # Mongoose schemas (User, Case, Evidence, AuditLog)
        ├── routes/     # API routers (complaint, assistant, auth)
        ├── services/   # AI services (redaction, classifier, briefGenerator)
        ├── agents/     # Autonomous AI agents (triageAgent, statuteAgent)
        └── middlewares/ # JWT auth & RBAC middleware
```

---

## 👥 Role-Based Access Control (RBAC)

Three roles are defined across the platform:

| Role | Access |
|------|--------|
| `complainant` | Submit complaints, view own cases, use AI assistant bot |
| `advocate` | View all cases, read raw descriptions, generate legal briefs |
| `admin` | Full system access, audit logs, user management |

---

## 🤖 AI Agent Architecture

All AI services use **Google Gemini API** (`gemini-1.5-pro`) with **mock fallback** support when the API key is not present.

### Agent 1 — Triage & Escalation Agent (`triageAgent.js`)
- Evaluates `riskScore` after classification.
- If `riskScore > 80` or `threatLevel === 'HIGH'`, auto-escalates case status to `URGENT`.
- Logs every autonomous action to `AuditLog` for accountability.

### Agent 2 — Statute Mapping Agent (`statuteAgent.js`)
- Reads case facts and maps them to specific legal statutes (IPC, IT Act, Title VII, FEHA, etc.).
- Returns a structured list of statute codes with relevance explanations.

### Agent 3 — Interactive Legal Assistant Bot (`assistant.js` + `LegalAssistantBot.tsx`)
- Real-time multi-turn chat bot embedded in the complainant intake form.
- Helps victims structure their statements and gather legally relevant details.
- System-prompted to be empathetic, trauma-informed, and non-judgmental.

### Core AI Services
- **PII Redaction** (`redactionService.js`): Anonymizes names, phone numbers, addresses, and emails before DB insertion.
- **Risk Classifier** (`classifierService.js`): Returns `{ threatLevel, riskScore, categories }` JSON.
- **Legal Brief Generator** (`briefGenerator.js`): Synthesizes case descriptions into formal briefs with summary, key facts, timeline, and potential violations.

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key (optional for mock mode)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

### Build for Production

```bash
cd frontend
npm run build   # Outputs to frontend/dist/
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens (min 32 chars recommended) |
| `GEMINI_API_KEY` | ⚠️ Optional | Google Gemini API key for AI features. Without it, all AI services run in **mock/fallback mode**. |
| `PORT` | ❌ | Server port (default: `5000`) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | ✅ | Backend API base URL (e.g., `http://localhost:5000`) |

---

## 📋 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT |
| `POST` | `/api/auth/register` | Public | Create new account |
| `POST` | `/api/complaint/intake` | Complainant | Submit a new complaint (auto PII redacted) |
| `GET` | `/api/cases` | Advocate/Admin | List all cases with filters |
| `GET` | `/api/cases/:id` | Advocate/Admin | Get detailed case view |
| `POST` | `/api/assistant/chat` | Authenticated | Chat with the Legal Assistant Bot |

---

## 🌿 Git Branch History

| Branch | Purpose |
|--------|---------|
| `feature/full-web-platform` | Auth, DB schemas, Advocate Dashboard, Case Details |
| `feature/core-ai-engine` | PII Redaction, Risk Classifier, Legal Brief Generator |
| `feature/ai-agents-framework` | Triage Agent, Statute Agent, Legal Assistant Bot |
| `feature/final-verification-docs` | Production build fixes, documentation |

---

## ⚖️ Safety & Ethics

- **Human-in-the-loop:** AI assists, never replaces, legal judgment.
- **PII by default:** Raw descriptions are restricted to advocates only; anonymized versions are used for general display.
- **Audit trail:** All autonomous agent actions are logged in `AuditLog` with timestamps and reasons.
- **Fallback mode:** All AI features degrade gracefully with mock responses when no API key is configured.

---

## 🚀 Deployment

### Backend (Render / Railway)
1. Set root directory to `backend/`
2. Build command: `npm install`
3. Start command: `node src/server.js`
4. Set all required environment variables from the table above.

### Frontend (Vercel)
1. Set root directory to `frontend/`
2. Build command: `npm run build`
3. Output directory: `dist/`
4. Set `VITE_API_BASE_URL` to your deployed backend URL.
