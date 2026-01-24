# PrepTrack

DSA & Placement Preparation Tracker – Striver-style sheet tracking, daily planner, streaks, analytics, PDF export, leaderboard, and admin panel.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Recharts, React Hot Toast
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Joi, Helmet, Morgan, PDFKit

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Setup

### 1. Clone / open project

```bash
cd preptrack
```

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, PORT, CORS_ORIGIN
```

### 3. Frontend

```bash
cd ../client
npm install
cp .env.example .env
# Edit .env: set VITE_API_URL (e.g. http://localhost:5000)
```

### 4. Environment variables

**Server (`.env` in `server/`):**

| Variable      | Description                    | Example                        |
|---------------|--------------------------------|--------------------------------|
| PORT          | API port                      | 5000                           |
| MONGODB_URI   | MongoDB connection string     | mongodb://localhost:27017/preptrack |
| JWT_SECRET    | Secret for JWT signing       | your-secret-key                |
| JWT_EXPIRES_IN| Token expiry                  | 7d                             |
| CORS_ORIGIN   | Allowed frontend origin(s)    | http://localhost:5173           |

**Client (`.env` in `client/`):**

| Variable     | Description        | Example                 |
|--------------|--------------------|-------------------------|
| VITE_API_URL | Backend API base   | http://localhost:5000   |

## Run

### Start MongoDB

Ensure MongoDB is running (e.g. `mongod` or MongoDB Atlas).

### Seed the database (first time)

From project root:

```bash
cd server
npm run seed
```

This creates:

- **Admin user:**  
  - Email: `admin@preptrack.com`  
  - Password: `Admin@123`
- Default sheet **“Striver A2Z”** with 8 topics: Arrays, Strings, Linked List, Stack/Queue, Binary Search, Recursion, DP, Graphs
- 50+ questions with difficulty and LeetCode links

### Start backend

```bash
cd server
npm run dev
# or: npm start
```

API: `http://localhost:5000`

### Start frontend

```bash
cd client
npm run dev
```

App: `http://localhost:5173`

## Test credentials

| Role  | Email                 | Password   |
|-------|------------------------|-----------|
| Admin | admin@preptrack.com   | Admin@123 |

Register any new user for a normal “user” account.

## Commands summary

| Task            | Command                    | Where   |
|-----------------|----------------------------|---------|
| Seed DB         | `npm run seed`             | server  |
| Backend dev     | `npm run dev` or `npm start` | server  |
| Frontend dev    | `npm run dev`              | client  |
| Frontend build  | `npm run build`            | client  |

## Features

- **Auth:** Register, Login, Logout, JWT, roles (user / admin)
- **Dashboard:** Totals, completed/revising/skipped, streak, last active, today’s progress, PDF export
- **Sheet Tracker:** Topics, questions, status (Not Started / Done / Revising / Skipped), notes, filters (topic, difficulty, status, search)
- **Daily Planner:** Set “questions per day”, generate today’s plan from “Not Started”, mark done, completion %
- **Analytics:** Topic-wise and difficulty-wise (done), weekly progress, PDF export
- **Leaderboard:** By completed, streak, weekly completed
- **Admin:** Sheets, Topics, Questions (CRUD + bulk JSON import), Users list
- **Dark mode:** Toggle, stored in `localStorage`
- **PDF export:** Progress report (Dashboard / Analytics)

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- `GET /api/sheets`, `POST /api/sheets` (admin), `PATCH /api/sheets/:id`, `DELETE /api/sheets/:id`
- `GET /api/topics?sheetId=`, `POST /api/topics`, `PATCH /api/topics/:id`, `DELETE /api/topics/:id`
- `GET /api/questions?topicId=&difficulty=&search=`, `POST /api/questions`, `POST /api/questions/bulk`, `PATCH /api/questions/:id`, `DELETE /api/questions/:id`
- `GET /api/progress`, `PATCH /api/progress/:questionId`
- `POST /api/daily-plan/generate`, `GET /api/daily-plan/today`, `PATCH /api/daily-plan/complete/:questionId`
- `GET /api/leaderboard`, `GET /api/dashboard`, `GET /api/analytics`
- `GET /api/export/progress/pdf`
- `GET /api/users` (admin)

## License

MIT
