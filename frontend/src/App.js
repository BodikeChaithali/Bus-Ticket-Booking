import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/homePage";
import SignUp from "./components/Signup";
import Login from "./components/login";
import Myprofile from "./components/myprofile";
import BusResults from "./pages/busresults";
import BusBooking from "./pages/busbooking";
import MyBookings from "./pages/mybooking";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";



function App() {
  return (
     <UserProvider>
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Myprofile />} />
          <Route path="/bus-results" element={<BusResults />} />
          <Route path="/bus/:id" element={<ProtectedRoute> <BusBooking /> </ProtectedRoute>} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;