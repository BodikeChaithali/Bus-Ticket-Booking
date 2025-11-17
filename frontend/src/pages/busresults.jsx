import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import SideBar from "../components/sideBar";
import "./css/busresults.css";

const BusResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fromCity, toCity, journeyDate } = location.state || {};
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    if (fromCity && toCity && journeyDate) {
      fetch(
        `http://localhost:5000/api/buses?from=${fromCity}&to=${toCity}&date=${journeyDate}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched buses:", data);
          setBuses(data);
        })
        .catch((err) => console.error(err));
    }
  }, [fromCity, toCity, journeyDate]);

  return (
    <div className="bus-results-page">
      <SideBar />

      <div className="results-content">
        {/* Header */}
        <header className="results-header">
          <h2>TripZy — Available Buses</h2>
          <p>Explore available options and book your journey easily.</p>
        </header>

        {/* Back to Home button */}
        <div className="back-container">
          <button className="back-btn" onClick={() => navigate("/")}>
            <FaArrowLeft className="back-icon" /> Back
          </button>
        </div>

        {/* Journey summary */}
        <div className="journey-summary glass-card">
          <div>
            <h3>
              <span className="from-city">{fromCity}</span> →{" "}
              <span className="to-city">{toCity}</span>
            </h3>
            <p>
              Date: <strong>{journeyDate}</strong>
            </p>
          </div>
        </div>

        {/* Bus list */}
        <div className="bus-list">
          {buses.length > 0 ? (
            buses.map((bus) => (
              <div key={bus.id} className="bus-card glass-card">
                <div className="bus-card-header">
                  <h3>{bus.name}</h3>
                  <div className="rating">
                    <FaStar /> {bus.rating}
                  </div>
                </div>

                <p>
                  {bus.from_city} → {bus.to_city}
                </p>
                <p>
                  {bus.departure_time} → {bus.arrival_time} ({bus.duration})
                </p>
                <p>Seats Left: {bus.seats_left}</p>
                <p>Price: ₹{bus.price}</p>

                <button
                  className="book-btn"
                  onClick={() =>
                    navigate(`/bus/${bus.id}`, { state: { bus } })
                  }
                >
                  Book Now
                </button>
              </div>
            ))
          ) : (
            <p>No buses found for this route.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusResults;
