import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../../contexts";

export default function AuthenticatedRoute({ children }) {
  const { pathname, search } = useLocation()
  const { isAuthenticated } = useContext(UserContext)

  if (!isAuthenticated()) {
    console.log("redirect to login,", isAuthenticated());
    return <Navigate to={`/login?redirect=${pathname}${search}`} />
  }

  return children
}