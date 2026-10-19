import React, { useState, useEffect, useContext } from "react";
import "./css/homePage.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { apiFetch } from "../api";

const HomePage = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [routes, setRoutes] = useState([]); // [{ from_city, to_city }] from the server
  const [routesError, setRoutesError] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // RECEIVE SIDEBAR STATE FROM LAYOUT
  const { isOpen } = useOutletContext();

  // Load the routes that actually exist, so the dropdowns can never offer a dead route
  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/routes")
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setRoutes(data);
      })
      .catch(() => {
        if (!cancelled) setRoutesError("Could not load cities. Please try again later.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fromCities = [...new Set(routes.map((r) => r.from_city))];
  const toCities = routes.filter((r) => r.from_city === fromCity).map((r) => r.to_city);

  // compute today's date in local timezone as YYYY-MM-DD (safe for min attribute)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  const handleFromChange = (value) => {
    setFromCity(value);
    setToCity(""); // the destination list depends on the departure city
  };

  // Handle search button click
  const handleSearch = () => {
    if (!fromCity || !toCity || !journeyDate) {
      alert("Please select all fields before searching.");
      return;
    }

    // Extra validation: ensure selected date is not before today
    if (journeyDate < minDate) {
      alert("Please choose a date that is today or later.");
      return;
    }

    // search lives in the URL, so the results page survives a refresh and can be shared
    const query = new URLSearchParams({ from: fromCity, to: toCity, date: journeyDate });
    navigate(`/bus-results?${query}`);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage">
      <div className="homepage-content">
        <header className="homepage-header">
          <div className="header-left">
            <h2>{user ? `Welcome back, ${user.name}!` : "Welcome to Tripzy!"}</h2>
          </div>

          <a className="signin-link" onClick={() => handleNavigate("/login")}>
            {isOpen || user ? "" : "Sign in for better experience"}
          </a>
        </header>

        {/* Book Your Journey Section */}
        <div className="home-container">
          <h1>Book Your Journey</h1>
          <p>Find the best buses for your trip</p>
          {routesError && <p className="routes-error">{routesError}</p>}

          <div className="search-box">
            <div className="input-group">
              <label>From</label>
              <select value={fromCity} onChange={(e) => handleFromChange(e.target.value)}>
                <option value="" disabled>
                  Select departure city
                </option>
                {fromCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>To</label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                disabled={!fromCity}
              >
                <option value="" disabled>
                  {fromCity ? "Select destination city" : "Select departure city first"}
                </option>
                {toCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Date of Journey</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={minDate} // prevents picking past dates
              />
            </div>

            <button className="search-btn" onClick={handleSearch}>
              🔍 Search Buses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
