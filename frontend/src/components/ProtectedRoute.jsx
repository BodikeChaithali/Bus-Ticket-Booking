import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  if (!user) {
  return <Navigate to="/signup" state={{ message: "Please signup to book tickets" }} replace />;
}
  return children;
}
