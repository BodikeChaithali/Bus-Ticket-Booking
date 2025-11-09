import React from "react";
import { FaBus, FaHome, FaUser, FaSignInAlt, FaTicketAlt } from "react-icons/fa";
import "./sideBar.css";

const SideBar = ({ isOpen, setIsOpen }) => {
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="menu-btn" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="brand">
            <FaBus className="bus-icon" />
            <h2>TripZy</h2>
          </div>
          <span className="close-btn" onClick={() => setIsOpen(false)}>
            ×
          </span>
        </div>

        <ul>
          <li><FaHome /> Home</li>
          <li><FaTicketAlt /> My Bookings</li>
          <li><FaUser /> My Profile</li>
          <li><FaSignInAlt /> Login / Signup</li>
        </ul>

        <footer>© 2025 TripZy</footer>
      </div>
    </>
  );
};

export default SideBar;
