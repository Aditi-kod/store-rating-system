const db = require('../config/database');

// @desc    Get Admin dashboard stats
// @route   GET /api/dashboard/Admin
// @access  Private/Admin
exports.getAdminDashboard = async (req, res) => {
    try {
        // Get total users count
        const [userCount] = await db.query(
            'SELECT COUNT(*) as total FROM users'
        );

        // Get total stores count
        const [storeCount] = await db.query(
            'SELECT COUNT(*) as total FROM stores'
        );

        // Get total ratings count
        const [ratingCount] = await db.query(
            'SELECT COUNT(*) as total FROM ratings'
        );

        // Get User count by role
        const [usersByRole] = await db.query(
            'SELECT role, COUNT(*) as count FROM users GROUP BY role'
        );

        // Get recent ratings
        const [recentRatings] = await db.query(
            `SELECT 
        r.id,
        r.rating,
        r.created_at,
        u.name as user_name,
        s.name as store_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       ORDER BY r.created_at DESC
       LIMIT 10`
        );

        // Get top rated stores
        const [topStores] = await db.query(
            `SELECT 
        s.id,
        s.name,
        s.address,
        AVG(r.rating) as average_rating,
        COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       GROUP BY s.id, s.name, s.address
       HAVING total_ratings > 0
       ORDER BY average_rating DESC
       LIMIT 5`
        );

        res.status(200).json({
            success: true,
            data: {
                totalUsers: userCount[0].total,
                totalStores: storeCount[0].total,
                totalRatings: ratingCount[0].total,
                usersByRole,
                recentRatings,
                topStores
            }
        });
    } catch (error) {
        console.error('Get Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

// @desc    Get store owner dashboard stats
// @route   GET /api/dashboard/store-owner
// @access  Private/StoreOwner
exports.getStoreOwnerDashboard = async (req, res) => {
    try {
        const storeId = req.user.storeId;

        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: 'No store associated with this account'
            });
        }

        // Get store details
        const [stores] = await db.query(
            'SELECT id, name, email, address FROM stores WHERE id = ?',
            [storeId]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Get average rating and total ratings
        const [ratingStats] = await db.query(
            `SELECT 
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_ratings
       FROM ratings 
       WHERE store_id = ?`,
            [storeId]
        );

        // Get rating distribution
        const [ratingDistribution] = await db.query(
            `SELECT 
        rating,
        COUNT(*) as count
       FROM ratings 
       WHERE store_id = ?
       GROUP BY rating
       ORDER BY rating DESC`,
            [storeId]
        );

        // Get users who rated (with their ratings)
        const [raters] = await db.query(
            `SELECT 
        u.id,
        u.name,
        u.email,
        r.rating,
        r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
            [storeId]
        );

        res.status(200).json({
            success: true,
            data: {
                store: stores[0],
                averageRating: parseFloat(ratingStats[0].average_rating.toFixed(2)),
                totalRatings: ratingStats[0].total_ratings,
                ratingDistribution,
                raters
            }
        });
    } catch (error) {
        console.error('Get store owner dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};