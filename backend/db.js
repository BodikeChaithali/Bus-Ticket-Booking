import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 ENV values read:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? " Loaded" : " Missing",
  DB_NAME: process.env.DB_NAME
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error(" MySQL connection error:", err);
  } else {
    console.log(" Connected to MySQL Database!");
  }
});

export default db;