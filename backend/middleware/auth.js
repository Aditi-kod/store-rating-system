const jwt = require('jsonwebtoken');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Please login.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add User info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            storeId: decoded.storeId
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please login again.'
        });
    }
};

module.exports = { protect };