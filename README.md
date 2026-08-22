# NDJ Invite

Digital invitation service MVP.

## Quick Start

### Prerequisites
- Docker & Docker Compose

### Launch

```bash
# Copy and configure env
cp .env.example .env

# Start all services
docker compose up -d

# Wait for backend to be ready, then access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
# MinIO:    http://localhost:9001
```

The database is auto-migrated and seeded on startup.

### Demo Account

```
Email:    admin@ndj.group
Password: admin123
```

### Demo Invitation

```
http://localhost:3000/invite/aliya-bekzat
```

## Development (without Docker)

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, SQLAlchemy, Alembic
- **Database:** PostgreSQL 16
- **Storage:** S3-compatible (MinIO for dev)

## Project Structure

```
ndj-invite/
├── frontend/          Next.js app
│   ├── app/           Pages & routes
│   ├── components/    UI components & templates
│   ├── lib/           API client
│   └── types/         TypeScript types
├── backend/           FastAPI app
│   ├── app/
│   │   ├── api/       API routes
│   │   ├── models/    SQLAlchemy models
│   │   ├── schemas/   Pydantic schemas
│   │   ├── auth/      Authentication
│   │   ├── services/  Business logic
│   │   ├── main.py    App entry
│   │   └── seed.py    Demo data
│   └── migrations/    Alembic migrations
├── docker-compose.yml
└── .env.example
```

## Features

- 3 invitation templates (Minimal, Premium, Kyrgyz)
- Admin panel with CRUD
- Photo upload via S3
- Guest RSVP system
- QR code generation
- Mobile-first responsive design
- Countdown timer
