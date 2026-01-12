# 🚀 GigFlow – Full Stack Freelance Marketplace

GigFlow is a full-stack freelance marketplace application where **clients post gigs**, **freelancers place bids**, and **clients hire exactly one freelancer per gig** with **transactional safety and real-time notifications**.

This project is built as part of a full-stack developer assignment and implements all **core** and **bonus** requirements.

---

## 🔑 Core Features

### 🔐 Authentication
- User Registration & Login
- JWT-based authentication using **HTTP-only cookies**
- Persistent login via `/api/auth/me`

---

### 📄 Gigs
- Create a new gig
- **Open Gigs**: View gigs created by other users
- **My Gigs**: View gigs created by the logged-in user

---

### 💼 Bidding & Hiring (Crucial Requirement)
- Freelancers can place a **Bid** (message + price) on open gigs
- Gig owner can view **all bids** for their gig
- Gig owner can **hire exactly one freelancer**
- On hiring:
  - Gig status changes from `open` → `assigned`
  - Selected bid becomes `hired`
  - All other bids are automatically marked as `rejected`

---

### 🔎 Search & Filter
- Search gigs by title
- Available on:
  - Open Gigs
  - My Gigs
  - My Bids

---

## ⭐ Bonus Features

### 🔐 Transactional Integrity (Race-Condition Safe)
- Hiring logic implemented using **MongoDB transactions**
- Prevents multiple hires if two requests happen simultaneously
- Ensures atomic updates for:
  - Gig status
  - Selected bid
  - Rejected bids

---

### ⚡ Real-Time Notifications
- Integrated **Socket.io**
- When a client hires a freelancer:
  - Freelancer receives an **instant real-time notification**
  - No page refresh required

---

## 🧱 Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- React Router
- Tailwind CSS
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Socket.io
- JWT Authentication
- MongoDB Transactions

---

## 🛠️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

⚠️ **Note**: .env files are intentionally not committed to the repository. Reference files `.env.example` are provided in both frontend and backend.

---

## ▶️ Running the Project Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend will run at: **http://localhost:5000**

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: **http://localhost:5173**

---

## 📦 API Architecture (Summary)

| Category | Method | Endpoint              | Description                  |
|----------|--------|-----------------------|------------------------------|
| Auth     | POST   | /api/auth/register    | Register new user            |
| Auth     | POST   | /api/auth/login       | Login & set HttpOnly cookie  |
| Auth     | GET    | /api/auth/me          | Get logged-in user           |
| Gigs     | GET    | /api/gigs             | Fetch open gigs              |
| Gigs     | POST   | /api/gigs             | Create a gig                 |
| Gigs     | GET    | /api/gigs/my          | Get my gigs                  |
| Bids     | POST   | /api/bids             | Place a bid                  |
| Bids     | GET    | /api/bids/:gigId      | Get bids for gig (owner only)|
| Hiring   | PATCH  | /api/bids/:bidId/hire | Hire freelancer (atomic)     |

---

## 🎥 Demo Video

A 2-minute Loom video demonstrating:

- Login / Register
- Creating a gig
- Placing bids
- Hiring a freelancer
- Real-time notification

📎 (Loom link to be attached)

---

## 🌍 Live Deployment

- **Frontend**: (Live URL to be added)
- **Backend**: (Live API URL to be added)

---

## 👨‍💻 Author

**Krishna Garg**  
Full-Stack Developer

