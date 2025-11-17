import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./css/busbooking.css";

const BusBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bus = location.state?.bus;

  const [numPassengers, setNumPassengers] = useState(1);
  const [passengers, setPassengers] = useState([{ name: "", age: "" }]);
  const [totalFare, setTotalFare] = useState(bus.price);
  const [ticket, setTicket] = useState(null);

  // Update passengers dynamically when count changes
  const handlePassengerCountChange = (count) => {
    const newCount = Math.max(1, Number(count));
    const updatedPassengers = Array.from({ length: newCount }, (_, i) => {
      return passengers[i] ? passengers[i] : { name: "", age: "" };
    });
    setNumPassengers(newCount);
    setPassengers(updatedPassengers);
    setTotalFare((bus.price * newCount).toFixed(2));
  };

  // Handle input change for name and age
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // When user clicks Confirm Booking
 // When user clicks Confirm Booking
const handleBooking = () => {
  if (passengers.some((p) => !p.name || !p.age)) {
    alert("⚠️ Please fill in all passenger details before confirming.");
    return;
  }

  const ticketData = {
    bus_name: bus.name,
    from_city: bus.from_city,
    to_city: bus.to_city,
    departure_time: bus.departure_time,
    total_passengers: numPassengers,
    total_fare: totalFare,
    passengers,
    date: new Date().toISOString().split("T")[0], // store today's date
  };

  // ✅ Save the booking to localStorage
  const existingBookings = JSON.parse(localStorage.getItem("tripzy_bookings")) || [];
  existingBookings.push(ticketData);
  localStorage.setItem("tripzy_bookings", JSON.stringify(existingBookings));

  // Show ticket immediately after confirming
  setTicket(ticketData);
};


  useEffect(() => {
    setTotalFare((bus.price * numPassengers).toFixed(2));
  }, [numPassengers, bus.price]);

  return (
    <div className="booking-page">
      {!ticket ? (
        <div className="booking-card glass-card">
          {/* Back Button */}
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft className="back-icon" /> Back
          </button>

          <h2>{bus.name}</h2>
          <p>
            {bus.from_city} → {bus.to_city}
          </p>
          <p>Departure: {bus.departure_time}</p>
          <p>Seats Left: {bus.seats_left}</p>
          <p>Fare per Passenger: ₹{bus.price}</p>
          <h3 className="total-fare">💰 Total Fare: ₹{totalFare}</h3>

          <div className="booking-form">
            <label>Number of Passengers:</label>
            <input
              type="number"
              min="1"
              value={numPassengers}
              onChange={(e) => handlePassengerCountChange(e.target.value)}
            />

            {passengers.map((p, i) => (
              <div key={i} className="passenger-fields">
                <h4>Passenger {i + 1}</h4>
                <div className="passenger-input-row">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={p.name}
                    onChange={(e) =>
                      handlePassengerChange(i, "name", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    min="1"
                    value={p.age}
                    onChange={(e) =>
                      handlePassengerChange(i, "age", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}

            <button className="confirm-btn" onClick={handleBooking}>
              Confirm Booking
            </button>
          </div>
        </div>
      ) : (
        <div className="ticket-card glass-card">
          <button className="back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft className="back-icon" /> Back to Home
          </button>

          <h2>🎟️ TripZy Ticket</h2>
          <p>
            <strong>Bus:</strong> {ticket.bus_name}
          </p>
          <p>
            <strong>From:</strong> {ticket.from_city} →{" "}
            <strong>To:</strong> {ticket.to_city}
          </p>
          <p>
            <strong>Departure:</strong> {ticket.departure_time}
          </p>
          <p>
            <strong>Passengers:</strong> {ticket.total_passengers}
          </p>
          <p>
            <strong>Total Fare:</strong> ₹{ticket.total_fare}
          </p>

          <div className="ticket-passengers">
            <h4>Passenger Details:</h4>
            <ul>
              {ticket.passengers.map((p, i) => (
                <li key={i}>
                  {p.name} — Age {p.age}
                </li>
              ))}
            </ul>
          </div>

          <p className="thank-you">✅ Booking Confirmed! Have a safe trip.</p>
        </div>
      )}
    </div>
  );
};

export default BusBooking;
