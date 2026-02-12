import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(formData);

            // Redirect based on role
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
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>⭐ Store Rating System</h1>
                    <h2>Welcome Back</h2>
                    <p>Login to your account</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                </div>

                <div className="demo-accounts">
                    <h4>Demo Accounts:</h4>
                    <div className="demo-grid">
                        <div className="demo-card">
                            <strong>Admin</strong>
                            <p>admin@storerating.com</p>
                            <p>Admin@123</p>
                        </div>
                        <div className="demo-card">
                            <strong>Store Owner</strong>
                            <p>john.smith@freshmarket.com</p>
                            <p>Owner@123</p>
                        </div>
                        <div className="demo-card">
                            <strong>User</strong>
                            <p>alice.williams@email.com</p>
                            <p>User@123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;