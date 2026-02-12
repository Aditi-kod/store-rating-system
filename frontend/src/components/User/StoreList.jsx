import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../../services/api';
import Navbar from '../Common/Navbar';
import './User.css';

const StoreList = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [filters, setFilters] = useState({
        name: '',
        address: '',
        sortBy: 'name',
        sortOrder: 'ASC'
    });

    useEffect(() => {
        fetchStores();
    }, [filters]);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await storeAPI.getAll(filters);
            setStores(response.data.data);
        } catch (err) {
            setError('Failed to load stores');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            address: '',
            sortBy: 'name',
            sortOrder: 'ASC'
        });
    };

    const openRatingModal = (store) => {
        setSelectedStore(store);
        setSelectedRating(store.user_rating || 0);
        setHoverRating(0);
        setShowRatingModal(true);
    };

    const handleSubmitRating = async () => {
        if (selectedRating === 0) {
            setError('Please select a rating');
            setTimeout(() => setError(''), 3000);
            return;
        }

        try {
            await ratingAPI.submit({
                storeId: selectedStore.id,
                rating: selectedRating
            });

            setSuccess(`Successfully rated ${selectedStore.name}!`);
            setShowRatingModal(false);
            fetchStores();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit rating');
            setTimeout(() => setError(''), 3000);
        }
    };

    const renderStars = (rating, interactive = false) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const filled = interactive
                ? (hoverRating >= i || (!hoverRating && selectedRating >= i))
                : (rating >= i);

            stars.push(
                <span
                    key={i}
                    className={`star ${filled ? 'filled' : 'empty'}`}
                    onClick={() => interactive && setSelectedRating(i)}
                    onMouseEnter={() => interactive && setHoverRating(i)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                >
          ⭐
        </span>
            );
        }
        return stars;
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="dashboard-header">
                    <h1>Available Stores</h1>
                </div>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Search and Filter */}
                <div className="filter-section">
                    <h3>Search Stores</h3>
                    <div className="filter-row">
                        <div className="form-group">
                            <label>Store Name</label>
                            <input
                                type="text"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder="Search by name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={filters.address}
                                onChange={handleFilterChange}
                                placeholder="Search by address"
                            />
                        </div>
                        <div className="form-group">
                            <label>Sort By</label>
                            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                                <option value="name">Name</option>
                                <option value="average_rating">Rating</option>
                                <option value="address">Address</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Order</label>
                            <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
                                <option value="ASC">Ascending</option>
                                <option value="DESC">Descending</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={resetFilters} className="btn btn-secondary mt-1">
                        Reset Filters
                    </button>
                </div>

                {/* Stores Grid */}
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading stores...</p>
                    </div>
                ) : stores.length > 0 ? (
                    <div className="stores-grid">
                        {stores.map((store) => (
                            <div key={store.id} className="store-card">
                                <div className="store-header">
                                    <h3>{store.name}</h3>
                                    <div className="store-rating">
                    <span className="rating-value">
                      {parseFloat(store.average_rating).toFixed(1)}
                    </span>
                                        <div className="rating-stars-display">
                                            {renderStars(Math.round(store.average_rating))}
                                        </div>
                                        <span className="rating-count">
                      ({store.total_ratings} {store.total_ratings === 1 ? 'rating' : 'ratings'})
                    </span>
                                    </div>
                                </div>

                                <div className="store-info">
                                    <p className="store-email">📧 {store.email}</p>
                                    <p className="store-address">📍 {store.address}</p>
                                </div>

                                <div className="store-actions">
                                    {store.user_rating ? (
                                        <div className="user-rating-section">
                                            <p className="your-rating-label">Your Rating:</p>
                                            <div className="your-rating">
                                                {renderStars(store.user_rating)}
                                            </div>
                                            <button
                                                onClick={() => openRatingModal(store)}
                                                className="btn btn-secondary btn-block"
                                            >
                                                Update Rating
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openRatingModal(store)}
                                            className="btn btn-primary btn-block"
                                        >
                                            Rate this Store
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center">
                        <p>No stores found</p>
                    </div>
                )}

                {/* Rating Modal */}
                {showRatingModal && selectedStore && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Rate {selectedStore.name}</h2>
                                <button onClick={() => setShowRatingModal(false)} className="modal-close">
                                    &times;
                                </button>
                            </div>

                            <div className="rating-modal-content">
                                <p className="rating-instruction">Click on the stars to rate:</p>
                                <div className="rating-stars-large">
                                    {renderStars(selectedRating, true)}
                                </div>
                                <p className="rating-text">
                                    {selectedRating > 0 ? (
                                        <>You selected: <strong>{selectedRating} star{selectedRating > 1 ? 's' : ''}</strong></>
                                    ) : (
                                        'Select a rating'
                                    )}
                                </p>
                            </div>

                            <div className="flex gap-2 mt-3">
                                <button onClick={handleSubmitRating} className="btn btn-success">
                                    Submit Rating
                                </button>
                                <button onClick={() => setShowRatingModal(false)} className="btn btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default StoreList;