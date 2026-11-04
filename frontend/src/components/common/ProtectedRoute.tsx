import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../../utils/auth";

interface ProtectedRouteProps {
  children: React.ReactElement;
  roleRequired?: "Admin" | "Student";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roleRequired,
}) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // If route requires admin, redirect to admin login
    if (roleRequired === "Admin") {
      return <Navigate to="/signinAdmin" state={{ from: location }} replace />;
    }
    // Otherwise redirect to student login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If route is restricted to Admin but user is not an Admin
  if (roleRequired === "Admin" && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
