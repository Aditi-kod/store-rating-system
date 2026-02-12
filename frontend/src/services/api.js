import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    getMe: () => api.get('/auth/me'),
    updatePassword: (passwords) => api.put('/auth/update-password', passwords)
};

// User APIs
export const userAPI = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (userData) => api.post('/users', userData),
    delete: (id) => api.delete(`/users/${id}`)
};

// Store APIs
export const storeAPI = {
    getAll: (params) => api.get('/stores', { params }),
    getById: (id) => api.get(`/stores/${id}`),
    create: (storeData) => api.post('/stores', storeData),
    update: (id, storeData) => api.put(`/stores/${id}`, storeData),
    delete: (id) => api.delete(`/stores/${id}`)
};

// Rating APIs
export const ratingAPI = {
    submit: (ratingData) => api.post('/ratings', ratingData),
    getUserRating: (storeId) => api.get(`/ratings/store/${storeId}`),
    getMyStoreRatings: () => api.get('/ratings/my-store'),
    delete: (storeId) => api.delete(`/ratings/store/${storeId}`)
};

// Dashboard APIs
export const dashboardAPI = {
    getAdminStats: () => api.get('/dashboard/admin'),
    getOwnerStats: () => api.get('/dashboard/store-owner')
};

export default api;