import React from "react";
import { FaBus, FaHome, FaUser, FaSignInAlt, FaTicketAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/sideBar.css";

const SideBar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const handleNavigate = (path) => {
    if (location.pathname !== path) navigate(path);
    closeMenu();
  };

  return (
    <>
      <button className="menu-btn" onClick={openMenu}>
        ☰
      </button>

      <div
        className={`sidebar ${isOpen ? "open" : "collapsed"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <div className="brand">
            <FaBus className="bus-icon" />
            <h2>TripZy</h2>
          </div>
          <span className="close-btn" onClick={closeMenu}>×</span>
        </div>

        <ul>
          <li onClick={() => handleNavigate("/")}><FaHome /> Home</li>
          <li onClick={() => handleNavigate("/bookings")}><FaTicketAlt /> My Bookings</li>
          <li onClick={() => handleNavigate("/profile")}><FaUser /> My Profile</li>
          <li onClick={() => handleNavigate("/signup")}><FaSignInAlt /> Login / Signup</li>
        </ul>

        <footer>© 2025 TripZy</footer>
      </div>
    </>
  );
};

export default SideBar;
