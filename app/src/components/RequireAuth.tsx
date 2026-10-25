import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { clearSession, getRole, isLoggedIn, Role } from "../config/auth";

interface RequireAuthProps {
  children: React.ReactElement;
  roles?: Role[]; // If set, only these roles may open the page
}

// Route guard for the UI. The backend is the real protection; this only avoids showing pages
// the user can't use. Logged-out users go to /login and come back here after logging in.
const RequireAuth: React.FC<RequireAuthProps> = ({ children, roles }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles) {
    const role = getRole();
    // A session saved before roles were stored: log in again to pick up the role
    if (!role) {
      clearSession();
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    if (!roles.includes(role)) {
      return <Navigate to="/homepage" replace state={{ messageKey: "routeGuard.adminOnly" }} />;
    }
  }

  return children;
};

export default RequireAuth;
