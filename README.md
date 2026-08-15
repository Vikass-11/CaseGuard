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
