import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        switch (user?.role) {
            case 'admin':
                return '/admin/dashboard';
            case 'store_owner':
                return '/owner/dashboard';
            case 'user':
                return '/user/stores';
            default:
                return '/';
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand" onClick={() => navigate(getDashboardLink())}>
                    ⭐ Store Rating System
                </div>

                {user && (
                    <div className="navbar-menu">
            <span className="navbar-user">
              Welcome, <strong>{user.name?.split(' ')[0]}</strong>
              <span className={`badge badge-${user.role === 'store_owner' ? 'owner' : user.role}`}>
                {user.role === 'store_owner' ? 'Owner' : user.role}
              </span>
            </span>

                        <button onClick={() => navigate('/change-password')} className="btn btn-secondary btn-sm">
                            Change Password
                        </button>

                        <button onClick={handleLogout} className="btn btn-danger btn-sm">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;