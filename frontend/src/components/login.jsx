import React, { useState } from "react";
import "./css/login.css";
import { FaGoogle, FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <FaLocationDot />
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-sub">Sign in to book your next journey</p>

        <form className="login-form" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="email" className="label-email">Email</label>
          <input
            id="email"
            className="input-email"
            type="text"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label htmlFor="password" className="label-password">Password</label>
          <div className="password-field">
            <input
              id="password"
              className="input-password"
              type={showPwd ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button
              type="button"
              className="toggle-click"
              onClick={() => setShowPwd((prev) => !prev)}
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="btn signin-btn">
            Sign In
          </button>

          <div className="divider">
            <span className="or">OR</span>
          </div>

          <div className="social-login">
            <button type="button" className="google">
              <FaGoogle /> Continue with Google
            </button>
          </div>

          <p className="signup">
            Don’t have an account?{" "}
            <a className="signup-link" onClick={() => handleNavigate("/signup")}>
              Sign up now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
