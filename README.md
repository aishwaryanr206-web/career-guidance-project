# CareerPath — Career Assessment & Student Profile Management System

A creative, responsive MERN-stack Phase 1 internship project.

## Live Website
https://client-five-blush-73.vercel.app

## Features
- Student registration and JWT login
- Student profile creation/editing
- 20-question career assessment
- Interest and skill analysis
- Rule-based career recommendation engine
- Dashboard with scores, recommendation cards and assessment history
- Responsive glassmorphism UI
- MongoDB integration
- REST APIs ready for Postman

## Career Domains
Software Development, Data Science, UI/UX Design, Digital Marketing, Cybersecurity, Business Analytics.

## Setup

### 1. Backend
```bash
cd server
npm install
copy .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Run:
```bash
npm run dev
```

### 2. Frontend
Open another terminal:
```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## API
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`
- GET/PUT `/api/profile`
- GET `/api/assessment/questions`
- POST `/api/assessment/submit`
- GET `/api/assessment/result`

## Notes
Do not commit `.env`, `node_modules`, or build folders.
