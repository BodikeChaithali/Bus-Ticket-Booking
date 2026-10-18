import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);
  const location = useLocation();

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Please login to continue", from: location.pathname }}
      />
    );
  }
  return children;
}
