import { useState, useContext } from "react";
import "./css/login.css";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { apiFetch } from "../api";

export default function Login() {
  const { setUser } = useContext(UserContext);
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }
      setUser(data.user);
      // go back to where the user was trying to go, otherwise home
      navigate(location.state?.from || "/", { replace: true });
    } catch {
      alert("Cannot reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo">
          <FaLocationDot />
        </div>

        <h2 className="login-title">Welcome Back</h2>
        <p className="login-sub">Sign in to book your next journey</p>
        {location.state?.message && <p className="alert">{location.state.message}</p>}
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="email" className="label-email">Email</label>
          <input
            id="email"
            className="input-email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
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
              required
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

          <button type="submit" className="btn signin-btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="signup">
            Don’t have an account?{" "}
            <Link className="signup-link" to="/signup">
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
