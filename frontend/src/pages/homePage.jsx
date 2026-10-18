import { useState, useContext } from "react";
import "./css/homePage.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const HomePage = () => {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [journeyDate, setJourneyDate] = useState("");

  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // RECEIVE SIDEBAR STATE FROM LAYOUT
  const { isOpen } = useOutletContext();

  // compute today's date in local timezone as YYYY-MM-DD (safe for min attribute)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

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

    navigate("/bus-results", {
      state: { fromCity, toCity, journeyDate },
    });
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

          <div className="search-box">
            <div className="input-group">
              <label>From</label>
              <select value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
                <option value="" disabled>
                  Select departure city
                </option>
                <option>Mumbai</option>
                <option>Pune</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div className="input-group">
              <label>To</label>
              <select value={toCity} onChange={(e) => setToCity(e.target.value)}>
                <option value="" disabled>
                  Select destination city
                </option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Delhi</option>
              </select>
            </div>

            <div className="input-group">
              <label>Date of Journey</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={minDate}            // <-- prevents picking past dates
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
