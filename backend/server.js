// server.js (Universal version — works on any computer)
import fs from "fs";
import path from "path";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const SQL_FILE = path.join(process.cwd(), "schema.sql");
const DB_NAME = process.env.DB_NAME || "bus_booking";

// 1) ROOT credentials ONLY for setup
const rootConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_ROOT_USER || "root",
  password: process.env.DB_ROOT_PASSWORD || "",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  multipleStatements: true,
};

// 2) Normal user (app uses this)
const appDbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "tripzy_user",
  password: process.env.DB_PASSWORD || "",
  database: DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
};

// STEP A — Create DB + user if missing
async function initializeDatabase() {
  const conn = await mysql.createConnection({
    ...rootConfig,
    multipleStatements: true,
  });

  try {
    console.log("🔧 Setting up database...");
    await conn.query(`
      CREATE DATABASE IF NOT EXISTS ${DB_NAME};
      CREATE USER IF NOT EXISTS 'tripzy_user'@'localhost' IDENTIFIED BY 'TripZy@123';
      GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO 'tripzy_user'@'localhost';
      FLUSH PRIVILEGES;
    `);
    console.log("✅ Database + user ready.");
  } finally {
    await conn.end();
  }
}

// STEP B — Run schema.sql
async function runSchema() {
  if (!fs.existsSync(SQL_FILE)) {
    console.log("⚠️ schema.sql not found — skipping.");
    return;
  }

  console.log("📄 Running schema.sql...");

  const sql = fs.readFileSync(SQL_FILE, "utf8");

  const conn = await mysql.createConnection({
    ...rootConfig,
    multipleStatements: true,
  });

  try {
    await conn.query(sql);
    console.log("schema.sql imported.");
  } catch (err) {
    console.error("Error in schema.sql:", err.message);
    throw err;
  } finally {
    conn.end();
  }
}

async function start() {
  try {
    await initializeDatabase();
    await runSchema();
  } catch (err) {
    console.error(" Startup failed:", err.message);
    process.exit(1);
  }

  const pool = mysql.createPool({
    ...appDbConfig,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // quick test
  await pool.query("SELECT 1");

  console.log(" Connected to MySQL!");

  const app = express();
  app.use(cors());
  app.use(express.json());


  app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  try {
    const [existing] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    res.json({ success: true, message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

  if (rows.length === 0) {
    return res.status(400).json({ error: "No account found. Please sign up." });
  }

  const user = rows[0];

  if (user.password !== password) {
    return res.status(400).json({ error: "Incorrect password" });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
    }
  });
});


  // API: buses
  app.get("/api/buses", async (req, res) => {
    const { from, to, date } = req.query;
    if (!from || !to || !date)
      return res.status(400).json({ error: "from, to, date are required" });

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const sql = `
      SELECT * FROM buses
      WHERE LOWER(from_city)=LOWER(?)
        AND LOWER(to_city)=LOWER(?)
        AND available_days LIKE CONCAT('%', ?, '%')
    `;

    const [rows] = await pool.query(sql, [from, to, dayOfWeek]);
    res.json(rows);
  });

  app.get("/", (req, res) => {
    res.send("TripZy Backend Running Successfully!");
  });

  app.listen(PORT, () =>
    console.log(` Server running on http://localhost:${PORT}`)
  );
}

start();
