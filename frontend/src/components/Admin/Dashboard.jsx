import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import Navbar from '../Common/Navbar';
import './Admin.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getAdminStats();
            setStats(response.data.data);
        } catch (err) {
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="dashboard-header">
                    <h1>Admin Dashboard</h1>
                    <div className="dashboard-actions">
                        <button onClick={() => navigate('/admin/users')} className="btn btn-primary">
                            Manage Users
                        </button>
                        <button onClick={() => navigate('/admin/stores')} className="btn btn-secondary">
                            Manage Stores
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-3">
                    <div className="stat-card">
                        <div className="stat-value">{stats.totalUsers}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.totalStores}</div>
                        <div className="stat-label">Total Stores</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.totalRatings}</div>
                        <div className="stat-label">Total Ratings</div>
                    </div>
                </div>

                {/* Users by Role */}
                <div className="card mt-3">
                    <h3>Users by Role</h3>
                    <div className="grid grid-3 mt-2">
                        {stats.usersByRole.map((item) => (
                            <div key={item.role} className="role-stat">
                <span className={`badge badge-${item.role === 'store_owner' ? 'owner' : item.role}`}>
                  {item.role === 'store_owner' ? 'Store Owner' : item.role}
                </span>
                                <span className="role-count">{item.count} users</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Ratings */}
                <div className="card mt-3">
                    <h3>Recent Ratings</h3>
                    {stats.recentRatings.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Store</th>
                                    <th>Rating</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats.recentRatings.map((rating) => (
                                    <tr key={rating.id}>
                                        <td>{rating.user_name}</td>
                                        <td>{rating.store_name}</td>
                                        <td>
                        <span className="rating-display">
                          {'⭐'.repeat(rating.rating)}
                        </span>
                                        </td>
                                        <td>{new Date(rating.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center">No ratings yet</p>
                    )}
                </div>

                {/* Top Rated Stores */}
                <div className="card mt-3">
                    <h3>Top Rated Stores</h3>
                    {stats.topStores.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Store Name</th>
                                    <th>Address</th>
                                    <th>Average Rating</th>
                                    <th>Total Ratings</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats.topStores.map((store) => (
                                    <tr key={store.id}>
                                        <td>{store.name}</td>
                                        <td>{store.address}</td>
                                        <td>
                        <span className="rating-display">
                          {parseFloat(store.average_rating).toFixed(1)} ⭐
                        </span>
                                        </td>
                                        <td>{store.total_ratings}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center">No ratings yet</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
