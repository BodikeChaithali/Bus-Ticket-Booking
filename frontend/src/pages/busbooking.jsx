import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { apiFetch } from "../api";
import "./css/busbooking.css";

const MAX_PASSENGERS = 6;

const BusBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [passengers, setPassengers] = useState([{ name: "", age: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState(null);

  // Always load the trip from the server so seats are fresh and refresh/direct links work
  const loadBus = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/buses/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load this bus");
      setBus(data);
      setPassengers((prev) =>
        prev.slice(0, Math.max(1, Math.min(MAX_PASSENGERS, data.seats_left)))
      );
      setLoadError("");
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBus();
  }, [loadBus]);

  if (loading) return <div className="booking-page"><p>Loading...</p></div>;

  if (loadError || !bus) {
    return (
      <div className="booking-page">
        <div className="booking-card glass-card">
          <p>{loadError || "Bus not found."}</p>
          <button className="confirm-btn" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  const maxSelectable = Math.min(MAX_PASSENGERS, bus.seats_left);
  const count = passengers.length;
  // derived value, not stored in state
  const totalFare = ((Math.round(Number(bus.price) * 100) * count) / 100).toFixed(2);

  const handleCountChange = (value) => {
    const n = Number(value);
    setPassengers((prev) =>
      Array.from({ length: n }, (_, i) => prev[i] ?? { name: "", age: "" })
    );
  };

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleBooking = async () => {
    setError("");

    if (passengers.some((p) => !p.name.trim() || p.age === "")) {
      setError("Please fill in all passenger details before confirming.");
      return;
    }
    if (passengers.some((p) => !Number.isInteger(Number(p.age)) || p.age < 1 || p.age > 120)) {
      setError("Age must be a whole number between 1 and 120.");
      return;
    }
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { message: "Please login to book tickets" } });
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/api/book", {
        method: "POST",
        body: JSON.stringify({
          trip_id: bus.id,
          passengers: passengers.map((p) => ({ name: p.name.trim(), age: Number(p.age) })),
        }),
      });
      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { state: { message: "Session expired, please login again" } });
        return;
      }
      if (!res.ok) {
        if (res.status === 409) loadBus(); // seats changed, refresh the number shown
        throw new Error(data.error || "Booking failed");
      }

      setTicket({
        booking_id: data.booking_id,
        bus_name: bus.name,
        from_city: bus.from_city,
        to_city: bus.to_city,
        travel_date: bus.travel_date,
        departure_time: bus.departure_time,
        total_passengers: data.num_passengers,
        total_fare: data.total_price,
        passengers,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      {!ticket ? (
        <div className="booking-card glass-card">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="back-icon" /> Back
          </button>

          <h2>{bus.name}</h2>
          <p>{bus.from_city} → {bus.to_city}</p>
          <p>Date: {bus.travel_date}</p>
          <p>Departure: {bus.departure_time}</p>
          <p>Seats Left: {bus.seats_left}</p>
          <p>Fare per Passenger: ₹{bus.price}</p>
          <h3 className="total-fare">💰 Total Fare: ₹{totalFare}</h3>

          {bus.seats_left === 0 ? (
            <p className="form-error">Sorry, this bus is sold out.</p>
          ) : (
            <div className="booking-form">
              <label htmlFor="num-passengers">Number of Passengers:</label>
              <select
                id="num-passengers"
                value={count}
                onChange={(e) => handleCountChange(e.target.value)}
              >
                {Array.from({ length: maxSelectable }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>

              {passengers.map((p, i) => (
                <div key={i} className="passenger-fields">
                  <h4>Passenger {i + 1}</h4>
                  <div className="passenger-input-row">
                    <input
                      type="text"
                      placeholder="Full Name"
                      maxLength={100}
                      value={p.name}
                      onChange={(e) => handlePassengerChange(i, "name", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      min="1"
                      max="120"
                      value={p.age}
                      onChange={(e) => handlePassengerChange(i, "age", e.target.value)}
                    />
                  </div>
                </div>
              ))}

              {error && <p className="form-error">{error}</p>}

              <button className="confirm-btn" onClick={handleBooking} disabled={submitting}>
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="ticket-card glass-card">
          <button className="back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft className="back-icon" /> Back to Home
          </button>

          <h2>🎟️ TripZy Ticket</h2>
          <p><strong>Booking ID:</strong> #{ticket.booking_id}</p>
          <p><strong>Bus:</strong> {ticket.bus_name}</p>
          <p>
            <strong>From:</strong> {ticket.from_city} → <strong>To:</strong> {ticket.to_city}
          </p>
          <p><strong>Travel Date:</strong> {ticket.travel_date}</p>
          <p><strong>Departure:</strong> {ticket.departure_time}</p>
          <p><strong>Passengers:</strong> {ticket.total_passengers}</p>
          <p><strong>Total Fare:</strong> ₹{ticket.total_fare}</p>

          <div className="ticket-passengers">
            <h4>Passenger Details:</h4>
            <ul>
              {ticket.passengers.map((p, i) => (
                <li key={i}>{p.name} — Age {p.age}</li>
              ))}
            </ul>
          </div>

          <p className="thank-you">✅ Booking Confirmed! Have a safe trip.</p>
          <button className="confirm-btn" onClick={() => navigate("/my-bookings")}>
            View My Bookings
          </button>
        </div>
      )}
    </div>
  );
};

export default BusBooking;
