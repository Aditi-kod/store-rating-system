import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Admin Components
import AdminDashboard from './components/Admin/Dashboard';
import UserManagement from './components/Admin/UserManagement';
import StoreManagement from './components/Admin/StoreManagement';

// User Components
import StoreList from './components/User/StoreList';

// Store Owner Components
import OwnerDashboard from './components/StoreOwner/OwnerDashboard.jsx';

// Other Components
import ChangePassword from './components/Layout/ChangePassword';

import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <UserManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/stores"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <StoreManagement />
                                </ProtectedRoute>
                            }
                        />

                        {/* User Routes */}
                        <Route
                            path="/user/stores"
                            element={
                                <ProtectedRoute allowedRoles={['user']}>
                                    <StoreList />
                                </ProtectedRoute>
                            }
                        />

                        {/* Store Owner Routes */}
                        <Route
                            path="/owner/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['store_owner']}>
                                    <OwnerDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Change Password - All authenticated users */}
                        <Route
                            path="/change-password"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'user', 'store_owner']}>
                                    <ChangePassword />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default Route */}
                        <Route path="/" element={<Navigate to="/login" />} />

                        {/* 404 Route */}
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;