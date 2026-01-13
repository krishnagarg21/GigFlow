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

## � Project Structure

```
gigflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── index.js
│   │   └── socket.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## �🛠️ Environment Variables

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

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **MongoDB** (local installation or cloud service like MongoDB Atlas)
- **npm** or **yarn** package manager

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

A Loom video demonstrating:

- Login / Register
- Creating a gig
- Placing bids
- Hiring a freelancer
- Real-time notification

📎 ([Video-link 1.5x preferred](https://www.loom.com/share/b9cc97c7fe8347c78a114c20a9f6ceb4))

---

## 🌍 Live Deployment

- **Frontend**: (https://gig-flow-wine.vercel.app/)
- **Backend**: (https://gigflow-nywe.onrender.com)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Krishna Garg**  
Full-Stack Developer

