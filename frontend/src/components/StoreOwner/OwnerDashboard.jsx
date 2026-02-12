import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api';
import Navbar from '../Common/Navbar';
import './StoreOwner.css';

const OwnerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getOwnerStats();
            setStats(response.data.data);
        } catch (err) {
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`star ${rating >= i ? 'filled' : 'empty'}`}>
          ⭐
        </span>
            );
        }
        return stars;
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
                    <h1>Store Owner Dashboard</h1>
                </div>

                {/* Store Info */}
                <div className="card store-info-card">
                    <h2>{stats.store.name}</h2>
                    <p className="store-detail">📧 {stats.store.email}</p>
                    <p className="store-detail">📍 {stats.store.address}</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-2">
                    <div className="stat-card">
                        <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
                        <div className="stat-label">Average Rating</div>
                        <div className="stat-stars">
                            {renderStars(Math.round(stats.averageRating))}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.totalRatings}</div>
                        <div className="stat-label">Total Ratings</div>
                    </div>
                </div>

                {/* Rating Distribution */}
                {stats.ratingDistribution.length > 0 && (
                    <div className="card mt-3">
                        <h3>Rating Distribution</h3>
                        <div className="rating-distribution">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const data = stats.ratingDistribution.find(r => r.rating === rating);
                                const count = data ? data.count : 0;
                                const percentage = stats.totalRatings > 0
                                    ? (count / stats.totalRatings) * 100
                                    : 0;

                                return (
                                    <div key={rating} className="distribution-row">
                                        <span className="rating-label">{rating} ⭐</span>
                                        <div className="distribution-bar">
                                            <div
                                                className="distribution-fill"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="rating-count">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Users Who Rated */}
                <div className="card mt-3">
                    <h3>Users Who Rated Your Store</h3>
                    {stats.raters.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Rating</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats.raters.map((rater) => (
                                    <tr key={rater.id}>
                                        <td>{rater.name}</td>
                                        <td>{rater.email}</td>
                                        <td>
                                            <div className="rating-cell">
                                                {renderStars(rater.rating)}
                                                <span className="rating-number">({rater.rating})</span>
                                            </div>
                                        </td>
                                        <td>{new Date(rater.created_at).toLocaleDateString()}</td>
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

export default OwnerDashboard;