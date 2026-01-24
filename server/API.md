# PrepTrack API

Base URL: `http://localhost:5000/api`

Send `Authorization: Bearer <token>` for protected routes. Token is returned from `/auth/login` and `/auth/register`.

## Auth

```http
POST /auth/register
Content-Type: application/json

{ "name": "Jane", "email": "jane@example.com", "password": "secret123" }
```

```http
POST /auth/login
Content-Type: application/json

{ "email": "jane@example.com", "password": "secret123" }
```

```http
GET /auth/me
Authorization: Bearer <token>
```

```http
POST /auth/logout
Authorization: Bearer <token>
```

## Sheets

```http
GET /sheets
```

```http
POST /sheets   [admin]
{ "name": "My Sheet", "description": "..." }
```

```http
PATCH /sheets/:id   [admin]
DELETE /sheets/:id   [admin]
```

## Topics

```http
GET /topics?sheetId=<id>
POST /topics   [admin]
{ "sheetId": "<id>", "name": "Arrays" }

PATCH /topics/:id   [admin]
DELETE /topics/:id   [admin]
```

## Questions

```http
GET /questions?topicId=&sheetId=&difficulty=Easy|Medium|Hard&search=...
POST /questions   [admin]
{ "sheetId", "topicId", "title", "link?", "difficulty?" }

POST /questions/bulk   [admin]
{ "questions": [ { "sheetId", "topicId", "title", "link?", "difficulty?" }, ... ] }

PATCH /questions/:id   [admin]
DELETE /questions/:id   [admin]
```

## Progress

```http
GET /progress   [user; returns { [questionId]: { status, note, updatedAt } } ]
PATCH /progress/:questionId
{ "status"?: "Not Started"|"Done"|"Revising"|"Skipped", "note"?: "..." }
```

## Daily plan

```http
POST /daily-plan/generate
{ "questionsPerDay": 5 }

GET /daily-plan/today

PATCH /daily-plan/complete/:questionId
```

## Dashboard, Analytics, Leaderboard, Export, Users

```http
GET /dashboard    # stats: totalQuestions, completed, revising, skipped, streakCount, lastActiveDate, todayTotal, todayDone, todayPercent
GET /analytics    # topicWise, difficultyWise, weeklyProgress
GET /leaderboard
GET /export/progress/pdf   # downloads PDF
GET /users   [admin]
```
