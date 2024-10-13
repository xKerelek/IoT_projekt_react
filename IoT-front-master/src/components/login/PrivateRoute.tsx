import React from "react";
import {Route, Navigate} from 'react-router-dom';
import { isExpired } from "react-jwt";

interface PrivateRouteProps {
    element: JSX.Element;
    path: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({element, path}) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token && !isExpired(token);

    if(!isAuthenticated) {
        alert('You must be logged in to view content!');
        return <Navigate to="/login"/>;
    }
    return element;
}