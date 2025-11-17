import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBus, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import "./css/mybooking.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tripzy_bookings")) || [];
    setBookings(saved);
  }, []);

  return (
    <div className="bookings-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Back
      </button>

      <h2>🚌 My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b, index) => (
            <div key={index} className="booking-item glass-card">
              <div className="bus-header">
                <FaBus className="bus-icon" />
                <h3>{b.bus_name}</h3>
              </div>
              <p>
                {b.from_city} → {b.to_city}
              </p>
              <p>
                <FaCalendarAlt /> {b.date} | Departure: {b.departure_time}
              </p>
              <p>Passengers: {b.total_passengers}</p>
              <p>Total Fare: ₹{b.total_fare}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;