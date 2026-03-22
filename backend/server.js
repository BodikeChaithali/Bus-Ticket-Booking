import fs from "fs";
import path from "path";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
const SQL_FILE = path.join(process.cwd(), "schema.sql");

// DB connection config used for running the SQL file (no default database)
const baseDbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  multipleStatements: true, // important to run whole .sql file
};

// The database name created by your schema.sql is `bus_booking` — we will use that for the pool
const DB_NAME = process.env.DB_NAME || "bus_booking";

async function runSqlFileIfExists() {
  if (!fs.existsSync(SQL_FILE)) {
    console.log("schema.sql not found — skipping SQL initialization.");
    return;
  }

  console.log("Found schema.sql — executing...");

  const sql = fs.readFileSync(SQL_FILE, "utf8");

  // Create a connection (without database) so CREATE DATABASE will work
  const conn = await mysql.createConnection(baseDbConfig);
  try {
    await conn.query(sql);
    console.log("schema.sql executed successfully.");
  } catch (err) {
    console.error("Error running schema.sql:", err.message || err);
    throw err;
  } finally {
    await conn.end();
  }
}

async function start() {
  // 1) Run SQL file to create DB/tables/seed data (idempotent because your SQL uses IF NOT EXISTS)
  try {
    await runSqlFileIfExists();
  } catch (err) {
    console.error("Failed to initialize DB from schema.sql — aborting startup.");
    process.exit(1);
  }

  // 2) Create pool pointing to the database created by schema.sql
  const pool = mysql.createPool({
    ...baseDbConfig,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // quick test connection
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS ok");
    // eslint-disable-next-line no-console
    console.log("Connected to MySQL and pool created (database:", DB_NAME + ")");
  } catch (err) {
    console.error("MySQL pool connection failed:", err.message || err);
    process.exit(1);
  }

  // 3) Start Express
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  app.use("/api", authRoutes);

  // Fetch buses by route
  // Example: GET /api/buses?from=Mumbai&to=Hyderabad&date=2025-11-20
  app.get("/api/buses", async (req, res) => {
    const { from, to, date } = req.query;
    if (!from || !to || !date)
      return res.status(400).json({ error: "from, to, and date are required" });

    // compute weekday name (English)
    let dayOfWeek;
    try {
      dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    } catch (err) {
      return res.status(400).json({ error: "invalid date format" });
    }

    const query = `
      SELECT * FROM buses
      WHERE LOWER(from_city) = LOWER(?)
        AND LOWER(to_city) = LOWER(?)
        AND available_days LIKE CONCAT('%', ?, '%')
    `;

    try {
      const [results] = await pool.query(query, [from, to, dayOfWeek]);
      res.json(results);
    } catch (err) {
      console.error("DB error /api/buses:", err.message || err);
      res.status(500).json({ error: "DB error" });
    }
  });

  // Get bus by ID
  app.get("/api/buses/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await pool.query("SELECT * FROM buses WHERE id = ?", [id]);
      if (!rows || rows.length === 0) return res.status(404).json({ error: "Bus not found" });
      res.json(rows[0]);
    } catch (err) {
      console.error("DB error /api/buses/:id:", err.message || err);
      res.status(500).json({ error: "DB error" });
    }
  });

  // Book a ticket (simple demo: updates seats_left)
  app.post("/api/book" , authMiddleware,async (req, res) => {
    const { bus_id, name, passengers, total_price } = req.body;
    if (!bus_id || !name || !passengers) {
      return res.status(400).json({ error: "bus_id, name and passengers are required" });
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // check available seats
      const [rows] = await conn.query("SELECT seats_left FROM buses WHERE id = ? FOR UPDATE", [bus_id]);
      if (rows.length === 0) {
        await conn.rollback();
        return res.status(404).json({ error: "Bus not found" });
      }

      const seatsLeft = rows[0].seats_left;
      if (seatsLeft < passengers) {
        await conn.rollback();
        return res.status(400).json({ error: "Not enough seats available" });
      }

      // reduce seats
      await conn.query("UPDATE buses SET seats_left = seats_left - ? WHERE id = ?", [passengers, bus_id]);

      // (Optional) you could insert into a bookings table here if you add one
      // await conn.query("INSERT INTO bookings (bus_id, name, passengers, total_price) VALUES (?, ?, ?, ?)", [bus_id, name, passengers, total_price]);

      await conn.commit();

      res.json({
        success: true,
        message: "Booking successful",
        name,
        passengers,
        total_price: typeof total_price === "number" ? total_price.toFixed(2) : total_price,
      });
    } catch (err) {
      await conn.rollback();
      console.error("DB error /api/book:", err.message || err);
      res.status(500).json({ error: "DB error" });
    } finally {
      conn.release();
    }
  });

  app.get("/", (req, res) => {
    res.send("TripZy backend is running successfully!");
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
    console.log(`Try: GET /api/buses?from=Mumbai&to=Hyderabad&date=2025-11-21`);
  });
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

