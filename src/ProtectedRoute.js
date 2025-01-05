import React, { useContext } from "react";
import Context from "./Context";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem("auth");
    return isAuthenticated ? children : <Navigate to="/login"/>
}

export default ProtectedRoute;
