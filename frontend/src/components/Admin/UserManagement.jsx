import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Navbar from '../Common/Navbar';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import './Admin.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        address: '',
        role: '',
        sortBy: 'name',
        sortOrder: 'ASC'
    });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getAll(filters);
            setUsers(response.data.data);
        } catch (err) {
            setError('Failed to load users');
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

        // Clear error for this field
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

        const passwordError = validatePassword(formData.password);
        if (passwordError) errors.password = passwordError;

        const addressError = validateAddress(formData.address);
        if (addressError) errors.address = addressError;

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await userAPI.create(formData);
            setSuccess('User created successfully');
            setShowModal(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                address: '',
                role: 'user'
            });
            fetchUsers();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await userAPI.delete(id);
            setSuccess('User deleted successfully');
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to delete user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const resetFilters = () => {
        setFilters({
            name: '',
            email: '',
            address: '',
            role: '',
            sortBy: 'name',
            sortOrder: 'ASC'
        });
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="dashboard-header">
                    <h1>User Management</h1>
                    <button onClick={() => setShowModal(true)} className="btn btn-primary">
                        + Add New User
                    </button>
                </div>

                {success && <div className="alert alert-success">{success}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Filters */}
                <div className="filter-section">
                    <h3>Filters</h3>
                    <div className="filter-row">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder="Search by name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="text"
                                name="email"
                                value={filters.email}
                                onChange={handleFilterChange}
                                placeholder="Search by email"
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
                            <label>Role</label>
                            <select name="role" value={filters.role} onChange={handleFilterChange}>
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="store_owner">Store Owner</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Sort By</label>
                            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                                <option value="name">Name</option>
                                <option value="email">Email</option>
                                <option value="role">Role</option>
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

                {/* Users Table */}
                <div className="card">
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : users.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Role</th>
                                    <th>Store</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.address || 'N/A'}</td>
                                        <td>
                        <span className={`badge badge-${user.role === 'store_owner' ? 'owner' : user.role}`}>
                          {user.role === 'store_owner' ? 'Store Owner' : user.role}
                        </span>
                                        </td>
                                        <td>
                                            {user.store_name || 'N/A'}
                                            {user.role === 'store_owner' && user.average_rating > 0 && (
                                                <span className="rating-small">
                            {' '}({parseFloat(user.average_rating).toFixed(1)} ⭐)
                          </span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
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
                        <p className="text-center">No users found</p>
                    )}
                </div>

                {/* Create User Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h2>Add New User</h2>
                                <button onClick={() => setShowModal(false)} className="modal-close">
                                    &times;
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser}>
                                <div className="form-group">
                                    <label>Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleFormChange}
                                        placeholder="Full name (20-60 characters)"
                                        required
                                    />
                                    {formErrors.name && <div className="error-text">{formErrors.name}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        placeholder="Email address"
                                        required
                                    />
                                    {formErrors.email && <div className="error-text">{formErrors.email}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Password *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        placeholder="Password (8-16 chars, 1 uppercase, 1 special)"
                                        required
                                    />
                                    {formErrors.password && <div className="error-text">{formErrors.password}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        placeholder="Address (max 400 characters)"
                                        rows="3"
                                    />
                                    {formErrors.address && <div className="error-text">{formErrors.address}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Role *</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="store_owner">Store Owner</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Create User
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

export default UserManagement;