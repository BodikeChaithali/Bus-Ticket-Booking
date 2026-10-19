import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import { apiFetch } from "../api";
import "./css/busresults.css";

const BusResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const fromCity = params.get("from");
  const toCity = params.get("to");
  const journeyDate = params.get("date");

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fromCity || !toCity || !journeyDate) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    const query = new URLSearchParams({ from: fromCity, to: toCity, date: journeyDate });
    apiFetch(`/api/buses?${query}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load buses");
        return data;
      })
      .then((data) => {
        if (!cancelled) setBuses(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setBuses([]);
        setError(
          err instanceof TypeError
            ? "Cannot reach the server. Please try again."
            : err.message
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fromCity, toCity, journeyDate]);

  const hasSearch = fromCity && toCity && journeyDate;

  let list;
  if (!hasSearch) {
    list = <p>Please start a new search from the home page.</p>;
  } else if (loading) {
    list = <p>Searching for buses...</p>;
  } else if (error) {
    list = <p>{error}</p>;
  } else if (buses.length === 0) {
    list = <p>No buses found for this route.</p>;
  } else {
    list = buses.map((bus) => (
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
          disabled={bus.seats_left === 0}
          onClick={() => navigate(`/bus/${bus.id}`)}
        >
          {bus.seats_left === 0 ? "Sold Out" : "Book Now"}
        </button>
      </div>
    ));
  }

  return (
    <div className="bus-results-page">
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
        {hasSearch && (
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
        )}

        {/* Bus list */}
        <div className="bus-list">{list}</div>
      </div>
    </div>
  );
};

export default BusResults;
