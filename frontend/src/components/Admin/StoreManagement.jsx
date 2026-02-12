import React, { useState, useEffect } from 'react';
import { storeAPI } from '../../services/api';
import Navbar from '../Common/Navbar';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import './Admin.css';

const StoreManagement = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        address: '',
        sortBy: 'name',
        sortOrder: 'ASC'
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        ownerName: '',
        ownerPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});

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

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: null
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        const nameError = validateName(formData.name);
        if (nameError) errors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;

        const addressError = validateAddress(formData.address);
        if (addressError) errors.address = addressError;

        // Owner details are optional
        if (formData.ownerName) {
            const ownerNameError = validateName(formData.ownerName);
            if (ownerNameError) errors.ownerName = ownerNameError;
        }

        if (formData.ownerPassword) {
            const passwordError = validatePassword(formData.ownerPassword);
            if (passwordError) errors.ownerPassword = passwordError;
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await storeAPI.create(formData);
            setSuccess('Store created successfully');
            setShowModal(false);
            setFormData({
                name: '',
                email: '',
                address: '',
                ownerName: '',
                ownerPassword: ''
            });
            fetchStores();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create store');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteStore = async (id) => {
        if (!window.confirm('Are you sure you want to delete this store? This will also delete all associated ratings.')) {
            return;
        }

        try {
            await storeAPI.delete(id);
            setSuccess('Store deleted successfully');
            fetchStores();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete store');
            setTimeout(() => setError(''), 3000);
        }
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            address: '',
            sortBy: 'name',
            sortOrder: 'ASC'
        });
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="dashboard-header">
                    <h1>Store Management</h1>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        + Add New Store
                    </button>
                </div>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Filters */}
                <div className="filter-section">
                    <h3>Filters</h3>
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
                                <option value="email">Email</option>
                                <option value="address">Address</option>
                                <option value="average_rating">Rating</option>
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

                {/* Stores Table */}
                <div className="card">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : stores.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Average Rating</th>
                                    <th>Total Ratings</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stores.map((store) => (
                                    <tr key={store.id}>
                                        <td>{store.name}</td>
                                        <td>{store.email}</td>
                                        <td>{store.address}</td>
                                        <td>
                        <span className="rating-display">
                          {parseFloat(store.average_rating).toFixed(1)} ⭐
                        </span>
                                        </td>
                                        <td>{store.total_ratings}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteStore(store.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center">No stores found</p>
                    )}
                </div>

                {/* Create Store Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Add New Store</h2>
                                <button onClick={() => setShowModal(false)} className="modal-close">
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleCreateStore}>
                                <h4 className="mb-2">Store Information</h4>

                                <div className="form-group">
                                    <label>Store Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="Store name (20-60 characters)"
                                        required
                                    />
                                    {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Store Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        placeholder="Store email address"
                                        required
                                    />
                                    {formErrors.email && <div className="error-text">{formErrors.email}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        placeholder="Store address (max 400 characters)"
                                        rows="3"
                                        required
                                    />
                                    {formErrors.address && <div className="error-text">{formErrors.address}</div>}
                                </div>

                                <h4 className="mb-2 mt-3">Store Owner (Optional)</h4>

                                <div className="form-group">
                                    <label>Owner Name</label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleFormChange}
                                        placeholder="Owner full name (20-60 characters)"
                                    />
                                    {formErrors.ownerName && <div className="error-text">{formErrors.ownerName}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Owner Password</label>
                                    <input
                                        type="password"
                                        name="ownerPassword"
                                        value={formData.ownerPassword}
                                        onChange={handleFormChange}
                                        placeholder="Password (8-16 chars, 1 uppercase, 1 special)"
                                    />
                                    {formErrors.ownerPassword && <div className="error-text">{formErrors.ownerPassword}</div>}
                                    <small className="form-hint">Owner will use store email to login</small>
                                </div>

                                <div className="flex gap-2 mt-3">
                                    <button type="submit" className="btn btn-primary">
                                        Create Store
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default StoreManagement;