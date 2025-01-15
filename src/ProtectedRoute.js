import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, isProtected }) {
    const isAuthenticated = localStorage.getItem("accessToken");
    if(isProtected) {
        return isAuthenticated ? children : <Navigate to="/login"/>;
    }
    return isAuthenticated ? <Navigate to="/"/> : children;
}

export default ProtectedRoute;
