import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import { UserContext } from "../context/UserContext";
import { apiFetch } from "../api";
import "./css/mybooking.css";

const MyBookings = () => {
  const { setUser } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await apiFetch("/api/bookings");
        if (res.status === 401) {
          setUser(null); // session expired -> ProtectedRoute sends us to login
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load bookings");
        if (!cancelled) setBookings(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [setUser]);

  let content;
  if (loading) {
    content = <p className="no-bookings">Loading your bookings...</p>;
  } else if (error) {
    content = <p className="no-bookings">{error}</p>;
  } else if (bookings.length === 0) {
    content = <p className="no-bookings">No bookings yet.</p>;
  } else {
    content = (
      <div className="booking-list">
        {bookings.map((b) => (
          <div key={b.id} className="booking-item glass-card">
            <div className="bus-header">
              <FaBus className="bus-icon" />
              <h3>{b.bus_name}</h3>
            </div>
            <p>Booking #{b.id} · {b.status}</p>
            <p>{b.from_city} → {b.to_city}</p>
            <p>
              <FaCalendarAlt /> {b.travel_date} | Departure: {b.departure_time}
            </p>
            <p>Passengers: {b.passengers?.map((p) => `${p.name} (${p.age})`).join(", ")}</p>
            <p>Total Fare: ₹{b.total_price}</p>
            <p>Booked on: {String(b.created_at).slice(0, 10)}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <h2>🚌 My Bookings</h2>
      {content}
    </div>
  );
};

export default MyBookings;