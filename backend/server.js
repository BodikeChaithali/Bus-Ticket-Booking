import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./db.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";

const PORT = process.env.PORT || 5000;
const MAX_PASSENGERS_PER_BOOKING = 6;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// "id" in API responses is the TRIP id (one bus on one date). bus_id is the bus itself.
const TRIP_SELECT = `
  SELECT t.id, b.id AS bus_id, b.name, b.from_city, b.to_city,
         TIME_FORMAT(b.departure_time, '%H:%i') AS departure_time,
         TIME_FORMAT(b.arrival_time, '%H:%i') AS arrival_time,
         b.duration, b.price, b.rating, t.travel_date, t.seats_left
  FROM trips t
  JOIN buses b ON b.id = t.bus_id
`;

// Returns e.g. "Monday", or null if the string is not a real YYYY-MM-DD date.
function weekdayOf(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== dateStr)
    return null;
  return d.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
    credentials: true, 
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api", authRoutes);

// GET /api/buses?from=Mumbai&to=Hyderabad&date=2026-11-20
app.get("/api/buses", async (req, res) => {
  const { from, to, date } = req.query;
  if (!from || !to || !date) {
    return res.status(400).json({ error: "from, to, and date are required" });
  }
  const weekday = weekdayOf(String(date));
  if (!weekday)
    return res.status(400).json({ error: "date must be a valid YYYY-MM-DD" });

  try {
    // Create the trips for this date on first search (safe to repeat: unique key + IGNORE)
    await pool.query(
      `INSERT IGNORE INTO trips (bus_id, travel_date, seats_left)
       SELECT id, ?, total_seats FROM buses
       WHERE from_city = ? AND to_city = ? AND FIND_IN_SET(?, available_days)`,
      [date, from, to, weekday],
    );

    const [rows] = await pool.query(
      `${TRIP_SELECT}
       WHERE b.from_city = ? AND b.to_city = ? AND t.travel_date = ?
       ORDER BY b.departure_time`,
      [from, to, date],
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/buses:", err.message);
    res.status(500).json({ error: "DB error" });
  }
});

// GET /api/buses/:id  (id = trip id)
app.get("/api/buses/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1)
    return res.status(400).json({ error: "Invalid id" });

  try {
    const [rows] = await pool.query(`${TRIP_SELECT} WHERE t.id = ?`, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Bus not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("GET /api/buses/:id:", err.message);
    res.status(500).json({ error: "DB error" });
  }
});

// POST /api/book   body: { trip_id, passengers: [{ name, age }] }
app.post("/api/book", authMiddleware, async (req, res) => {
  const tripId = Number(req.body.trip_id);
  const list = req.body.passengers;

  if (!Number.isInteger(tripId) || tripId < 1) {
    return res.status(400).json({ error: "trip_id is required" });
  }
  if (
    !Array.isArray(list) ||
    list.length < 1 ||
    list.length > MAX_PASSENGERS_PER_BOOKING
  ) {
    return res.status(400).json({
      error: `Between 1 and ${MAX_PASSENGERS_PER_BOOKING} passengers are allowed per booking`,
    });
  }
  const passengers = list.map((p) => ({
    name: String(p?.name ?? "").trim(),
    age: Number(p?.age),
  }));
  if (
    passengers.some(
      (p) =>
        !p.name ||
        p.name.length > 100 ||
        !Number.isInteger(p.age) ||
        p.age < 1 ||
        p.age > 120,
    )
  ) {
    return res
      .status(400)
      .json({
        error: "Each passenger needs a name and an age between 1 and 120",
      });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // lock the trip row so two people can't take the last seat at the same time
    const [rows] = await conn.query(
      `SELECT t.id, t.seats_left, b.price
       FROM trips t JOIN buses b ON b.id = t.bus_id
       WHERE t.id = ? FOR UPDATE`,
      [tripId],
    );
    if (rows.length === 0) throw new HttpError(404, "Trip not found");

    const trip = rows[0];
    const count = passengers.length;
    if (trip.seats_left < count) {
      throw new HttpError(409, `Only ${trip.seats_left} seat(s) left`);
    }

    // price comes from the DB, never from the client
    const totalPrice = (
      (Math.round(Number(trip.price) * 100) * count) /
      100
    ).toFixed(2);

    const [upd] = await conn.query(
      "UPDATE trips SET seats_left = seats_left - ? WHERE id = ? AND seats_left >= ?",
      [count, tripId, count],
    );
    if (upd.affectedRows !== 1)
      throw new HttpError(409, "Seats no longer available");

    const [ins] = await conn.query(
      "INSERT INTO bookings (user_id, trip_id, num_passengers, total_price) VALUES (?, ?, ?, ?)",
      [req.user.userId, tripId, count, totalPrice],
    );
    await conn.query(
      "INSERT INTO booking_passengers (booking_id, name, age) VALUES ?",
      [passengers.map((p) => [ins.insertId, p.name, p.age])],
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      booking_id: ins.insertId,
      trip_id: tripId,
      num_passengers: count,
      total_price: totalPrice,
      seats_left: trip.seats_left - count,
    });
  } catch (err) {
    if (conn) await conn.rollback().catch(() => {});
    if (err instanceof HttpError)
      return res.status(err.status).json({ error: err.message });
    console.error("POST /api/book:", err.message);
    res.status(500).json({ error: "DB error" });
  } finally {
    if (conn) conn.release();
  }
});

// GET /api/bookings  -> the logged-in user's bookings
app.get("/api/bookings", authMiddleware, async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT bk.id, bk.num_passengers, bk.total_price, bk.status, bk.created_at,
              t.travel_date, b.name AS bus_name, b.from_city, b.to_city,
              TIME_FORMAT(b.departure_time, '%H:%i') AS departure_time
       FROM bookings bk
       JOIN trips t ON t.id = bk.trip_id
       JOIN buses b ON b.id = t.bus_id
       WHERE bk.user_id = ?
       ORDER BY bk.created_at DESC`,
      [req.user.userId],
    );

    if (bookings.length > 0) {
      const [people] = await pool.query(
        "SELECT booking_id, name, age FROM booking_passengers WHERE booking_id IN (?)",
        [bookings.map((b) => b.id)],
      );
      for (const b of bookings) {
        b.passengers = people.filter((p) => p.booking_id === b.id);
      }
    }
    res.json(bookings);
  } catch (err) {
    console.error("GET /api/bookings:", err.message);
    res.status(500).json({ error: "DB error" });
  }
});

app.get("/", (req, res) => res.send("TripZy backend is running successfully!"));

// catches anything unexpected (e.g. malformed JSON body)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res
    .status(err.status || 500)
    .json({ error: err.status ? err.message : "Server error" });
});

try {
  await pool.query("SELECT 1");
  console.log(`Connected to MySQL (database: ${process.env.DB_NAME})`);
} catch (err) {
  console.error("MySQL connection failed:", err.message);
  process.exit(1);
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
