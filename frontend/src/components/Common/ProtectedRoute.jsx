import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin/dashboard" />;
            case 'store_owner':
                return <Navigate to="/owner/dashboard" />;
            case 'user':
                return <Navigate to="/user/stores" />;
            default:
                return <Navigate to="/login" />;
        }
    }

    return children;
};

export default ProtectedRoute;