import React from "react";
import "./myprofile.css";

export default function Myprofile() {
  const user = {
    name: "Name",
    email: "name@example.com",
    age: 22,
  };
  return (
    <div className="profile-page">
     <div className="profile-content"> 
        <h1 className="profile-title">My Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-age">Age: {user.age}</p>

        <button className="bookings-btn">My Bookings</button>
      </div>
    </div>
  );
}

