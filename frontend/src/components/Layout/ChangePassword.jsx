import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Common/Navbar';
import { validatePassword } from '../../utils/validation';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        const passwordError = validatePassword(formData.newPassword);
        if (passwordError) {
            newErrors.newPassword = passwordError;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await authAPI.updatePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            setSuccess('Password updated successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            setTimeout(() => {
                switch (user.role) {
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'store_owner':
                        navigate('/owner/dashboard');
                        break;
                    case 'user':
                        navigate('/user/stores');
                        break;
                    default:
                        navigate('/');
                }
            }, 2000);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card" style={{ maxWidth: '600px', margin: '50px auto' }}>
                    <h2>Change Password</h2>
                    <p style={{ color: '#718096', marginBottom: '30px' }}>
                        Update your password to keep your account secure
                    </p>

                    {success && <div className="alert alert-success">{success}</div>}
                    {apiError && <div className="alert alert-error">{apiError}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Current Password *</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                required
                            />
                            {errors.currentPassword && (
                                <div className="error-text">{errors.currentPassword}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>New Password *</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                            />
                            {errors.newPassword && (
                                <div className="error-text">{errors.newPassword}</div>
                            )}
                            <small className="form-hint">
                                8-16 characters, 1 uppercase letter, 1 special character
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password *</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                            />
                            {errors.confirmPassword && (
                                <div className="error-text">{errors.confirmPassword}</div>
                            )}
                        </div>

                        <div className="flex gap-2 mt-3">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;