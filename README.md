# NIC Valsad Office Management

A self-hostable office workflow application for NIC Valsad District. Source code is maintained in GitHub; the application is designed to run on an approved server with PostgreSQL.

## Modules
- RFMS Query Management
- Daily Work Diary
- VC Management
- Network Management
- Seva Setu Management
- Reports & Dashboard
- ICT Asset Management
- Staff Tour & Attendance
- Events & Training

## Technology
- React + TypeScript + Vite
- Express + TypeScript API
- PostgreSQL database
- SQL migrations in `database/migrations`
- GitHub as the source of truth

## Local development
Requirements: Node.js 20+, npm, PostgreSQL 15+.

1. Copy `.env.example` to `.env` and set local values.
2. Create an empty PostgreSQL database.
3. Apply SQL migrations in filename order using psql.
4. Install dependencies: `npm install`
5. Start frontend and API: `npm run dev`

The current milestone provides the UI foundation and API health endpoint. Authentication and protected CRUD APIs are the next implementation milestone; do not deploy with real office data until these are completed and reviewed.

## Security
- Never commit passwords, tokens, database URLs, VC meeting URLs, personal data, or operational records.
- Use fictional demo content only in development.
- Keep the repository private.
- Production deployment must follow NIC/MeitY security, hosting, access-control, backup, and audit requirements.
- Do not expose database credentials or privileged API keys in frontend code.

## Project status
Milestone 1: repository foundation, responsive module dashboard, API health endpoint, and initial relational schema.
