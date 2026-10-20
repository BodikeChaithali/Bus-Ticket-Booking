import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const missing = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"].filter((k) => !process.env[k]);
if (process.env.DB_PASSWORD === undefined) missing.push("DB_PASSWORD");
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

function buildSsl() {
  if (process.env.DB_SSL !== "true") return undefined;
  if (process.env.DB_CA) return { ca: process.env.DB_CA.replace(/\\n/g, "\n") };
  if (process.env.DB_CA_PATH) return { ca: fs.readFileSync(process.env.DB_CA_PATH) };
  return { rejectUnauthorized: true };
}

export const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: buildSsl(),
  dateStrings: true,
  timezone: "Z",
};

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
