import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import { dbConfig } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = ["schema.sql", "seed_buses.sql"];

const conn = await mysql.createConnection({
  ...dbConfig,
  multipleStatements: true,
});
try {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    await conn.query(sql);
    console.log(`Executed ${file}`);
  }
  console.log("Database ready.");
} catch (err) {
  console.error("DB init failed:", err.message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
