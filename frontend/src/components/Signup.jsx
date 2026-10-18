import React, { useState } from "react";
import "./css/Signup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";



export default function SignUp() {
  const { setUser } = useContext(UserContext);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
 
  return (
    <div className="su-page">
      <h1 className="su-mainheading">Welcome to TripZy!</h1>
      <div className="su-card">
        <h1 className="su-title">Create Account</h1>
        <p className="su-subtitle">Sign up to book your next journey</p>

        <form className="su-form">
          <label className="su-label">Full name</label>
           <input
            className="su-input"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="su-label">Email</label>
          <input
            className="su-input"
            type="email"
            placeholder="your@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="su-label">Password</label>
          <div className="su-input-wrapper">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Create a password"
              className="su-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="su-show"
               onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          <button
  className="su-primary"
  type="button"
  onClick={async () => {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Account created successfully!");

    // redirect to login page
    navigate("/login", {
      state: { message: "Signup successful, please login" },
    });
  }}
>
  Create account
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