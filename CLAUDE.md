# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Finovora is a full-stack personal finance management app. The repo is a single repository with a React frontend at the root and an Express.js backend in `/api`.

- **Frontend**: React 19, TanStack Router (file-based), TanStack Query, Tailwind CSS v4, shadcn/ui
- **Backend**: Express.js 5, Sequelize ORM, MySQL
- **Auth**: JWT (access + refresh tokens), sessions in DB, email verification via Resend

## Commands

### Frontend (root)
```bash
npm run dev        # Vite dev server on http://localhost:5173
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Backend (`/api`)
```bash
npm run dev        # nodemon + ts-node hot-reload on port 3000
npm run build      # tsc compilation
npm run typecheck  # Type checking without emit
npm run migrate:up   # Run Sequelize migrations
npm run migrate:down # Rollback last migration
npm run seed:all     # Run all seeders
```

## Architecture

### Frontend

**Routing**: TanStack Router with file-based routing in `src/routes/`. Route files use `createFileRoute`. Layouts use `_layout` naming.

**Data fetching**: TanStack Query for server state. API calls go through action functions in `src/utils/actions/` which use the Axios instance from `src/configs/axios.ts`. The Axios instance:
- Sends cookies (`withCredentials: true`)
- Shows toast notifications on success/error via Sonner
- Intercepts 401s and redirects to `/auth/login`

**Global state**: React Context in `src/context/` — `UserDetailsContext` (current user + main account), `ThemeProvider`.

**UI**: shadcn/ui components in `src/components/ui/`. Use the `cn()` utility from `src/lib/utils.ts` for conditional classNames.

**Path alias**: `@/` maps to `src/`.

### Backend

**Entry point**: `api/src/index.ts` — sets up Express, registers middleware, mounts all routers.

**Feature structure**: Each feature under `api/src/features/{feature}/` follows this pattern:
```
{feature}.controller.ts   # Route handlers
{feature}.routes.ts       # Express router
{feature}.schema.ts       # Zod DTOs for request validation
{feature}.service.ts      # Business logic (sometimes)
{feature}.ts              # Sequelize model
```

**Auth routes** are in `api/src/auth/` (sessions, verifications).

**Database**: MySQL via Sequelize with TypeScript decorators (`@Table`, `@Column`, etc.). `DatabaseFactory.createDatabaseConnection()` returns a singleton `SequelizeDatabaseWrapper`. All models are registered in `api/src/config/db/`.

**Middleware**:
- `authMiddleware` — validates JWT access token, attaches `req.user`
- `validateDTO(schema)` — Zod validation on `req.body`
- Global error handler in `api/src/middleware/`

**Auth flow**: Registration → email OTP → verify → access token (short-lived) + refresh token (30-day session in DB). Refresh via `/sessions/refresh`.

**Cron jobs**: `api/jobs/currenciesExchangeJob.ts` updates exchange rates on a schedule using node-cron.

## Environment Variables

Frontend (`.env`):
```
VITE_API_URL=http://localhost:3000
```

Backend (`api/.env`):
```
NODE_ENV=development
PORT=3000
CLIENT_APP_ORIGIN=http://localhost:5173
RESEND_API_KEY=...
EMAIL_SENDER=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

Database credentials are in `api/config/config.json` (used by Sequelize CLI for migrations).
