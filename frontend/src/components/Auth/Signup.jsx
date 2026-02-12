import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateName, validateEmail, validatePassword, validateAddress } from '../../utils/validation';
import './Auth.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        const addressError = validateAddress(formData.address);
        if (addressError) newErrors.address = addressError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await signup(formData);
            navigate('/user/stores');
        } catch (err) {
            setApiError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>⭐ Store Rating System</h1>
                    <h2>Create Account</h2>
                    <p>Sign up to start rating stores</p>
                </div>

                {apiError && <div className="alert alert-error">{apiError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name (20-60 characters)"
                            required
                        />
                        {errors.name && <div className="error-text">{errors.name}</div>}
                        <small className="form-hint">Minimum 20 characters, Maximum 60 characters</small>
                    </div>

                    <div className="form-group">
                        <label>Email Address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                        {errors.email && <div className="error-text">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label>Password *</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                        {errors.password && <div className="error-text">{errors.password}</div>}
                        <small className="form-hint">8-16 characters, 1 uppercase, 1 special character</small>
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address (optional, max 400 characters)"
                            rows="3"
                        />
                        {errors.address && <div className="error-text">{errors.address}</div>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;