import React, { useState } from "react";
import "../Css/login.css";
import { FaGoogle, FaLocationDot } from "react-icons/fa6";

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <FaLocationDot />
        </div>

        <h2>Welcome Back</h2>
        <p>Sign in to book your next journey</p>

        <form>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
          />
<label htmlFor="password">Password</label>
<div className="password-field">
  <input
    id="password"
    type={showPwd ? "text" : "password"}
    placeholder="Enter your password"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
  />
</div>


          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn">
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
            Don’t have an account? <a href="#">Sign up now</a>
          </p>
        </form>
      </div>
    </div>
  );
};