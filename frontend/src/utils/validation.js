export const validateName = (name) => {
    if (!name || name.trim().length < 20) {
        return 'Name must be at least 20 characters';
    }
    if (name.trim().length > 60) {
        return 'Name must not exceed 60 characters';
    }
    return null;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return 'Please provide a valid email address';
    }
    return null;
};

export const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (password.length > 16) {
        return 'Password must not exceed 16 characters';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[!@#$%^&*]/.test(password)) {
        return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
};

export const validateAddress = (address) => {
    if (address && address.length > 400) {
        return 'Address must not exceed 400 characters';
    }
    return null;
};

export const validateRating = (rating) => {
    const num = parseInt(rating);
    if (isNaN(num) || num < 1 || num > 5) {
        return 'Rating must be between 1 and 5';
    }
    return null;
};