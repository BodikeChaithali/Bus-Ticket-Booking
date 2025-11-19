📘 TripZy – Bus Ticket Booking System
TripZy is a full-stack bus ticket booking system built using React, Node.js, Express, and MySQL.
It allows users to search buses, create an account, log in, view profile, and book bus tickets with real-time seat updates.

🚀 Features
  ⭐ Frontend (React) 
       -> User signup & login
       -> Profile page with user information
       -> Global User Context (Context API)
       -> Bus search by route & date
       -> Bus results with filters
       -> Bus details page
       -> Ticket booking
       -> My bookings page
       -> Protected booking (requires login)

  ⭐ Backend (Node.js + Express)
      -> Auto-runs schema.sql on server startup
      -> MySQL connection pool with configuration
      -> Bus Search API
      -> Bus Details API
      -> Ticket Booking Transaction (locks row, updates seats)
      -> Seats Left check with rollback
      -> CORS enabled
      -> Clean ESM module structure

  ⭐ Database (MySQL)
      -> users table
      -> buses table
      -> Optional bookings table
      -> Preloaded sample bus data
      -> Auto-created on first backend run

📁 Project Structure
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

⚙️ Installation Guide
     📌 Prerequisites
         Make sure you have installed:
          Node.js (v18+)
          MySQL Server
          npm

🛠️ Backend Setup
      1️⃣ Go to backend folder
          cd backend
      2️⃣ Install dependencies
          npm install
      3️⃣ Create .env file

     Inside backend/, create a file named .env:
     DB_HOST=localhost
     DB_PORT=3306

# App user
DB_USER=tripzy_user
DB_PASSWORD=TripZy@123
DB_NAME=bus_booking

# Root user for automatic setup
DB_ROOT_USER=root
DB_ROOT_PASSWORD=your_mysql_root_password
PORT=5000

        4️⃣ Run backend server
           node server.js
 If everything is correct, you should see:
   Found schema.sql — executing...
   schema.sql executed successfully.
   Connected to MySQL and pool created (database: bus_booking)
   🚀 Server running on port 5000
   Try: GET /api/buses?from=Mumbai&to=Hyderabad&date=2025-11-21

 🖥️ Frontend Setup
    1️⃣ Open frontend folder:
        cd ../frontend
    2️⃣ Install frontend dependencies:
        npm install
    3️⃣ Start the react frontend:
        npm start
    Runs at:
   👉 http://localhost:3000
🔐 Authentication Flow
   ✔ Signup
      User info stored in MySQL
      Redirects to login

   ✔ Login
      Validates user from MySQL
      Saves user in Context API
      Redirects to profile

    ✔ Protected Routes
       /bus/:id (Booking page)
       /my-bookings
       /profile
       If NOT logged in → redirect to Login with message.

📡 API Endpoints
   🔹 GET /api/buses
      Search buses by route & day of week.
   🔹 GET /api/buses/:id
      Fetch bus details by ID.
   🔹 POST /api/book
      Simple booking API using transactions:
      
  ✔ Locks row
  ✔ Checks seats_left
  ✔ Updates seats safely

🎨 Tech Stack
  🔹Frontend
     React
     Context API
     React Router
     CSS
  🔹Backend
     Node.js
     Express
     MySQL2 (Promise API)
  🔹Database
     MySQL
     schema.sql auto-creation

🧪 Future Enhancements
     JWT Authentication
     Payment integration
     Seat selection UI
     Admin dashboard
     Email notifications