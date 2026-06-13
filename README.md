# OutReach – AI-Native Mini CRM

> **Xeno Engineering Internship Assignment 2026**

A full-stack, AI-native Mini CRM that helps D2C brands segment shoppers, run personalized multi-channel campaigns, and track real-time performance with AI-powered insights.

---

## 🚀 Live Demo

- **Frontend (Vercel):** _(Add after deployment)_
- **Backend (Render):** _(Add after deployment)_

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4.3, Framer Motion, shadcn/ui |
| Backend | Node.js, Express.js, MongoDB Atlas, Passport.js |
| AI | Google Gemini 2.0 Flash |
| Auth | Google OAuth 2.0 |
| Deployment | Vercel (frontend), Render (backend + channel service) |

---

## 🏗️ Architecture

```
Browser (React)
    │
    ▼
CRM Backend (:8000)  ──────────►  Channel Service (:8001)
   MongoDB Atlas              ◄──── Async callbacks
   Google OAuth
   Gemini AI
```

---

## ✨ Features

- **Dashboard** – Live stats: customers, campaigns, delivery rate, revenue chart
- **Customers** – CRUD, search/filter, city/gender filter, pagination
- **Orders** – Order log with customer links, revenue stats
- **Segments** – Rule-based builder + AI natural language → rules (Gemini)
- **Campaigns** – Create, AI-generate message, send to segment via channel service
- **Campaign Report** – Per-user delivery log, AI insights (Gemini), live polling
- **AI Studio** – Chat interface for segment ideas and message generation
- **Google OAuth** – Secure authentication
- **Dark/Light Mode** – Theme toggle

---

## 🤖 AI Features

1. **AI Segment Rules** – Describe your audience → Gemini generates MongoDB rules
2. **AI Message Writer** – Channel + segment → personalized campaign copy
3. **AI Campaign Insights** – Post-campaign analysis with actionable recommendations

---

## 📡 Channel Service Flow

```
1. Marketer sends campaign
2. CRM creates Communication records
3. CRM calls channel-service POST /channel/send
4. Channel service returns 200 immediately
5. After 2-12 seconds, channel service calls CRM POST /api/receipts per recipient
6. CRM updates Communication status & Campaign stats
7. Campaign Report page auto-refreshes every 5s
```

---

## 🗄️ Running Locally

### Backend

```bash
cd Xeno/backend
npm install
# Add .env (see .env.example)
npm run seed        # Seed 50 customers + orders
npm run dev         # Start on :8000
```

### Channel Service

```bash
cd Xeno/channel-service
npm install
npm run dev         # Start on :8001
```

### Frontend

```bash
cd Xeno/frontend
npm install
npm run dev         # Start on :5173
```

---

## 🌐 Deployment

### Frontend → Vercel
- Root: `Xeno/frontend`
- Build command: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://your-backend.onrender.com`

### Backend → Render
- Root: `Xeno/backend`
- Start command: `node server.js`
- Env: Set all `.env` vars
- Update `GOOGLE_REDIRECT_URI` to Render URL

### Channel Service → Render
- Root: `Xeno/channel-service`
- Start command: `node server.js`
- Env: `CRM_RECEIPT_URL=https://your-backend.onrender.com/api/receipts`

---

## 📁 Project Structure

```
Xeno/
├── frontend/          React + Vite app
├── backend/           CRM Express API
├── channel-service/   Stubbed messaging simulator
└── docs/              Architecture & design docs
```
