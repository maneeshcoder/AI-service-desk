# AI Service Desk

An AI-powered enterprise IT helpdesk. Employees raise tickets; AI automatically categorizes issues, assigns priority, summarizes descriptions, suggests solutions, detects duplicates, and routes tickets to the right support team. Role-based dashboards for employees, support engineers, and admins.

> **Status:** In development — see [Roadmap](#roadmap) below.
>
> <!-- Add once deployed: **[Live demo →](your-deployed-url-here)** -->

---

## Table of contents
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Why these choices](#why-these-choices)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Roadmap](#roadmap)

---

## Architecture

The app is a modular monolith split into five layers, each only talking to the layer directly below it:

```
Client (Next.js)
      ↓
API + Auth (Express, JWT, RBAC)
      ↓
Business Logic + AI (services, Gemini)
      ↓
Data + Cache (MongoDB, Redis)
      ↓
Infra (Docker Compose, CI/CD)
```

<!-- Add a screenshot/export of the architecture diagram here once you have one, e.g.: -->
<!-- ![Architecture diagram](./docs/architecture.png) -->

Socket.IO runs alongside the API layer for real-time ticket status updates and notifications.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Query |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB, Redis |
| AI | Gemini API |
| Auth | JWT, bcrypt, Role-Based Access Control |
| Real-time | Socket.IO |
| File storage | Cloudinary |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Testing | Jest, Supertest |

## Why these choices

<!-- Fill this in as you build — this section is what makes the project read as engineered rather than assembled. -->

- **MongoDB over PostgreSQL** — ticket structure is document-friendly (variable fields per category) and it pairs naturally with the JS/TS stack. Tradeoff: weaker relational guarantees, mitigated by keeping references (not deep embeds) between Users and Tickets.
- **Gemini over OpenAI** — comparable function-calling/structured-output support, with a usable free tier for a project at this scale.
- **Redis** — caches repeated AI categorization results and backs session/rate-limit state, avoiding redundant Gemini calls and a single-instance-only in-memory cache.
- **Socket.IO over SSE/polling** — ticket comments need bidirectional communication (engineer replies), not just one-way pushes.
- **Modular monolith over microservices** — one deployable with clean internal boundaries, correct for this scale; the layering (routes → controllers → services → models) is what would make a future split into services straightforward if it were ever needed.

## Getting started

```bash
git clone https://github.com/<your-username>/ai-service-desk.git
cd ai-service-desk

# copy env templates and fill in your own values
cp server/.env.example server/.env
cp client/.env.example client/.env.local

docker-compose up --build
```

App runs at `http://localhost:3000` (client) and `http://localhost:5000` (API), once configured.

### Environment variables

| Variable | Where | Description |
|---|---|---|
| `MONGODB_URI` | server | MongoDB connection string |
| `REDIS_URL` | server | Redis connection string |
| `JWT_SECRET` | server | Secret for signing access tokens |
| `GEMINI_API_KEY` | server | Google AI Studio API key |
| `CLOUDINARY_URL` | server | Cloudinary credentials |
| `NEXT_PUBLIC_API_URL` | client | Base URL of the backend API |

## Project structure

```
ai-service-desk/
├── client/          Next.js app (UI, dashboards)
├── server/          Express API (routes, services, models)
├── docker-compose.yml
└── .github/workflows/
```

## Roadmap

- [ ] Auth + RBAC + ticket CRUD
- [ ] AI categorization, priority, summarization
- [ ] Duplicate detection (embeddings)
- [ ] Redis caching layer
- [ ] Real-time updates via Socket.IO
- [ ] Tests (Jest + Supertest)
- [ ] Docker Compose + CI/CD + deployment
