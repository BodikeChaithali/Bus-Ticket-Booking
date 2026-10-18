import React, { useState, useContext } from "react";
import "./css/Signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { apiFetch } from "../api";

export default function SignUp() {
  const { setUser } = useContext(UserContext);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not create account");
        return;
      }

      // the server already logged us in (cookie set), so go straight to home
      setUser(data.user);
      navigate("/", { replace: true });
    } catch {
      alert("Cannot reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="su-page">
      <h1 className="su-mainheading">Welcome to TripZy!</h1>
      <div className="su-card">
        <h1 className="su-title">Create Account</h1>
        <p className="su-subtitle">Sign up to book your next journey</p>

        <form className="su-form" onSubmit={handleSignup}>
          <label className="su-label">Full name</label>
          <input
            className="su-input"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label className="su-label">Email</label>
          <input
            className="su-input"
            type="email"
            placeholder="your@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label className="su-label">Password</label>
          <div className="su-input-wrapper">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Create a password (min 6 characters)"
              className="su-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={6}
              required
            />
            <button
              type="button"
              className="su-show"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          <button className="su-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>

          <div className="su-or-divider">OR</div>

          <button type="button" className="su-google-btn">
            <FontAwesomeIcon icon={faGoogle} className="su-google-fa" />
            Continue with Google
          </button>

          <div className="su-label su-login">
            Have an account? <a onClick={() => navigate("/login")}>Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}