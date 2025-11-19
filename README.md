# 📘 TripZy – Bus Ticket Booking System

TripZy is a complete bus ticket booking platform built using **React**, **Node.js**, **Express**, and **MySQL**.  
It enables users to search buses, create an account, log in, view their profile, and book bus tickets with real-time seat updates.

---

## 🚀 Features

### ⭐ Frontend (React)
- User signup & login  
- Profile page with user information  
- Global User Context (Context API)  
- Bus search by route & date  
- Bus results with filters  
- Bus details page  
- Ticket booking  
- My bookings page  
- Protected booking routes (requires login)  

### ⭐ Backend (Node.js + Express)
- Auto-runs `schema.sql` on server startup  
- MySQL connection pool  
- Bus Search API  
- Bus Details API  
- Ticket booking using SQL transactions  
- Locked row booking system  
- Seats-left validation with rollback  
- ESM clean structure  
- CORS enabled  

### ⭐ Database (MySQL)
- `users` table  
- `buses` table  
- Optional `bookings` table  
- Preloaded sample bus data  
- Auto-created on first backend run  

---

## 📁 Project Structure
```
Bus-Ticket-Booking/
│
├── backend/
│   ├── server.js
│   ├── schema.sql
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/UserContext.jsx
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation Guide

### 📌 Prerequisites
- Node.js (v18+)
- MySQL Server
- npm

## 🛠️ Backend Setup

1. Go to backend folder:
```
cd backend
```

2. Install backend dependencies:
```
npm install
```

3. Create `.env` file:
```
DB_HOST=localhost
DB_PORT=3306

DB_USER=tripzy_user
DB_PASSWORD=TripZy@123
DB_NAME=bus_booking

DB_ROOT_USER=root
DB_ROOT_PASSWORD=your_mysql_root_password
PORT=5000
```

4. Run backend:
```
node server.js
```

## 🖥️ Frontend Setup

1. Go to frontend:
```
cd ../frontend
```

2. Install frontend dependencies:
```
npm install
```

3. Run React app:
```
npm start
```

## 🔐 Authentication Flow

✔ Signup → Stores user → Redirects to login  
✔ Login → Loads user into Context API → Redirects to profile  
✔ Protected Routes:
```
/bus/:id
/my-bookings
/profile
```

## 📡 API Endpoints

### GET /api/buses
```
Search buses by route & date
```

### GET /api/buses/:id
```
Fetch a bus by ID
```

### POST /api/book
```
Transactional booking:
- Locks row
- Validates seats_left
- Updates seats
- Rolls back on failure
```

## 🎨 Tech Stack

### Frontend
```
React
Context API
React Router
CSS
```

### Backend
```
Node.js
Express
MySQL2 (promise)
```

### Database
```
MySQL
schema.sql auto-creation
```

## 🧪 Future Enhancements
```
JWT Authentication
Payment Integration
Seat Selection UI
Admin Dashboard
Email Notifications
```
## 👤 Contributor

- [**Bodike Chaithali**](https://github.com/BodikeChaithali)
- [**Kusuma Teja**](https://github.com/kusumateja16)
- [**Sai Mounika**](https://github.com/KotapatiSaiMounika)

## 🔗 Project GitHub Repository
- [**Bus-Ticket-Booking**](https://github.com/BodikeChaithali/Bus-Ticket-Booking/)
