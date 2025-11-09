import React, { useState } from "react";
import SideBar from "../components/sideBar";
import "./homePage.css";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`homepage ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="homepage-content">
        <header className="homepage-header">
         <div className="header-left">
        

        <h2>Welcome to Tripzy!</h2>
        </div>
        <a href="/login" className="signin-link">
        Sign in for better experience
        </a>
        </header>


        {/* Book Your Journey Section */}
        <div className="home-container">
          <h1>Book Your Journey</h1>
          <p>Find the best buses for your trip</p>

          <div className="search-box">
            <div className="input-group">
              <label>From</label>
              <select defaultValue="">
                <option value="" disabled>Select departure city</option>
                <option>Mumbai</option>
                <option>Pune</option>
                <option>Bangalore</option>
              </select>
            </div>

            <div className="input-group">
              <label>To</label>
              <select defaultValue="">
                <option value="" disabled>Select destination city</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Delhi</option>
              </select>
            </div>

            <div className="input-group">
              <label>Date of Journey</label>
              <input type="date" />
            </div>

            <button className="search-btn">🔍 Search Buses</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
