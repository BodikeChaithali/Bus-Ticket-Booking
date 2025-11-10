import React, { useState } from "react";
import "./css/Signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";


export default function SignUp() {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };
  return (
    <div className="su-page">
      <h1 className="su-mainheading">Welcome to TripZy!</h1>
      <div className="su-card">
        <h1 className="su-title">Create Account</h1>
        <p className="su-subtitle">Sign up to book your next journey</p>

        <form className="su-form">
          <label className="su-label">Full name</label>
          <input className="su-input" placeholder="Your full name" />

          <label className="su-label">Email</label>
          <input className="su-input" type="email" placeholder="your@example.com" />

          <label className="su-label">Password</label>
          <div className="su-input-wrapper">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Create a password"
              className="su-input"
            />
            <button
              type="button"
              className="su-show"
              onClick={() => setShowPwd((s) => !s)}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          <button className="su-primary">Create account</button>

          {/* ✅ Continue with Google text */}
          <div className="su-or-divider">OR</div>

          {/* ✅ Google button */}
          <button type="button" className="su-google-btn">
            <FontAwesomeIcon icon={faGoogle} className="su-google-fa" />
              Continue with Google
          </button>

          <div className="su-label su-login">
            Have an account? <a onClick={() => handleNavigate("/login")} >Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
