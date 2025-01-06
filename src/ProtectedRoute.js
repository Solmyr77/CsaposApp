import React, { useContext } from "react";
import Context from "./Context";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, isProtected }) {
    const isAuthenticated = localStorage.getItem("auth");
    if(isProtected) {
        return isAuthenticated ? children : <Navigate to="/login"/>;
    }
    return isAuthenticated ? <Navigate to="/"/> : children;
}

export default ProtectedRoute;
