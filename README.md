# 🎉 EventHub — AI-Powered Smart Event Management Platform

<div align="center">

![EventHub Banner](https://img.shields.io/badge/EventHub-AI%20Powered-blueviolet?style=for-the-badge&logo=sparkles)
![MIT-WPU](https://img.shields.io/badge/MIT--WPU-Project-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)

*A comprehensive event management platform for MIT-WPU college clubs and students, powered by AI.*

</div>

---

## 📌 Overview

**EventHub** is a full-stack AI-powered smart event management platform built for MIT-WPU. It enables students to discover, register for, and manage college events across clubs, while providing organizers with powerful tools to create and track events. The platform also features an AI Assistant, a college Marketplace, and Club management — all in one place.

---

## ✨ Features

### 🗓️ Event Management
- Browse and search upcoming college events
- Register/unregister for events with one click
- View detailed event info (venue, date, organizer, description)
- Filter events by category and club

### 🤖 AI Assistant
- Ask questions about events, clubs, and campus life
- Get personalized event recommendations
- Powered by an intelligent backend AI controller

### 🏫 Club Management
- Browse all college clubs
- View club profiles with member details and events
- Follow/unfollow clubs

### 🛒 Marketplace
- Buy & sell college-related products
- Browse listings with images, prices, and descriptions
- Product detail pages

### 🔐 Authentication
- Secure JWT-based login & registration
- Role-based access (Student / Organizer / Admin)
- Protected routes

### 📊 Dashboard
- Personalized user dashboard
- View registered events and club memberships
- Quick stats and upcoming event reminders

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Vite |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **AI** | Custom AI Controller (server-side) |
| **HTTP Client** | Axios |
| **Notifications** | react-hot-toast |
| **Dev Tools** | Nodemon, Vite HMR |

---

## 📁 Project Structure

```
MIT-WPU EventHub/
├── client/                     # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── TopHeader.jsx
│   │   │       └── ProtectedLayout.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── Clubs.jsx
│   │   │   ├── ClubProfile.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   └── ProductDetail.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── clubController.js
│   │   ├── eventController.js
│   │   ├── marketplaceController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Club.js
│   │   ├── Product.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── ai.js
│   │   ├── auth.js
│   │   ├── clubs.js
│   │   ├── events.js
│   │   ├── marketplace.js
│   │   └── users.js
│   ├── data/
│   │   └── db.json
│   ├── seed.js
│   ├── index.js
│   └── package.json
│
├── package.json                # Root scripts
├── start.bat                   # Windows one-click startup script
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [MongoDB](https://www.mongodb.com/) (local or Atlas cloud)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Atulkumar2468/EventHub-AI-Powered-Smart-Event-Management-Platform.git
cd EventHub-AI-Powered-Smart-Event-Management-Platform
```

### 2. Setup Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Install Dependencies

**Install all dependencies at once (from root):**
```bash
npm run install-all
```

Or install manually:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Seed the Database (Optional)

Populate the database with sample data:

```bash
cd server
node seed.js
```

### 5. Run the Application

**Option A — Windows (One-click):**
```bash
start.bat
```

**Option B — Manual (two terminals):**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

**Option C — From root:**
```bash
npm run dev
```

### 6. Open in Browser

```
Frontend: http://localhost:5173
Backend API: http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT token |
| `GET` | `/api/events` | Get all events |
| `GET` | `/api/events/:id` | Get event by ID |
| `POST` | `/api/events/:id/register` | Register for an event |
| `GET` | `/api/clubs` | Get all clubs |
| `GET` | `/api/clubs/:id` | Get club profile |
| `GET` | `/api/marketplace` | Get all marketplace products |
| `GET` | `/api/marketplace/:id` | Get product by ID |
| `POST` | `/api/ai/chat` | Send message to AI assistant |
| `GET` | `/api/users/profile` | Get current user profile |

---

## 🧑‍💻 Author

**Atul Kumar**
- 🎓 MIT World Peace University (MIT-WPU)
- 🐙 GitHub: [@Atulkumar2468](https://github.com/Atulkumar2468)

---

## 📄 License

This project is built for educational purposes at MIT-WPU. All rights reserved © 2026.

---

<div align="center">
  Made with ❤️ at MIT-WPU
</div>
