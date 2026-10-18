import { useContext } from "react";
import { FaBus, FaHome, FaUser, FaSignInAlt, FaSignOutAlt, FaTicketAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./css/sideBar.css";

const SideBar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(UserContext);

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  const handleNavigate = (path) => {
    if (location.pathname !== path) navigate(path);
    closeMenu();
  };

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  return (
    <>
      {!isOpen && (
        <button className="menu-btn" onClick={openMenu}>
          ☰
        </button>
      )}

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
          <li onClick={() => handleNavigate("/my-bookings")}><FaTicketAlt /> My Bookings</li>
          <li onClick={() => handleNavigate("/profile")}><FaUser /> My Profile</li>
          {user ? (
            <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
            ) : (
            <li onClick={() => handleNavigate("/signup")}><FaSignInAlt /> Login / Signup</li>
          )}
        </ul>

        <footer>© 2025 TripZy</footer>
      </div>
    </>
  );
};

export default SideBar;
