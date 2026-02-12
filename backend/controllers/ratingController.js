const db = require('../config/database');

// @desc    Submit or update rating for a store
// @route   POST /api/ratings
// @access  Private/User
exports.submitRating = async (req, res) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;

        // Check if store exists
        const [stores] = await db.query(
            'SELECT id FROM stores WHERE id = ?',
            [storeId]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Check if User has already rated this store
        const [existingRatings] = await db.query(
            'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );

        if (existingRatings.length > 0) {
            // Update existing rating
            await db.query(
                'UPDATE ratings SET rating = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND store_id = ?',
                [rating, userId, storeId]
            );

            return res.status(200).json({
                success: true,
                message: 'Rating updated successfully',
                data: { rating }
            });
        }

        // Insert new rating
        await db.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
            [userId, storeId, rating]
        );

        res.status(201).json({
            success: true,
            message: 'Rating submitted successfully',
            data: { rating }
        });
    } catch (error) {
        console.error('Submit rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting rating',
            error: error.message
        });
    }
};

// @desc    Get ratings for store owner's store
// @route   GET /api/ratings/my-store
// @access  Private/StoreOwner
exports.getMyStoreRatings = async (req, res) => {
    try {
        const storeId = req.user.storeId;

        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: 'No store associated with this account'
            });
        }

        // Get all ratings for the store
        const [ratings] = await db.query(
            `SELECT 
        r.id,
        r.rating,
        r.created_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
            [storeId]
        );

        // Get average rating
        const [avgResult] = await db.query(
            'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = ?',
            [storeId]
        );

        res.status(200).json({
            success: true,
            data: {
                averageRating: parseFloat(avgResult[0].average_rating.toFixed(2)),
                totalRatings: ratings.length,
                ratings
            }
        });
    } catch (error) {
        console.error('Get my store ratings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ratings',
            error: error.message
        });
    }
};

// @desc    Get User's rating for a specific store
// @route   GET /api/ratings/store/:storeId
// @access  Private/User
exports.getUserRatingForStore = async (req, res) => {
    try {
        const userId = req.user.id;
        const storeId = req.params.storeId;

        const [ratings] = await db.query(
            'SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );

        if (ratings.length === 0) {
            return res.status(200).json({
                success: true,
                data: { rating: null }
            });
        }

        res.status(200).json({
            success: true,
            data: { rating: ratings[0].rating }
        });
    } catch (error) {
        console.error('Get User rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching rating',
            error: error.message
        });
    }
};

// @desc    Delete rating
// @route   DELETE /api/ratings/store/:storeId
// @access  Private/User
exports.deleteRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const storeId = req.params.storeId;

        const [result] = await db.query(
            'DELETE FROM ratings WHERE user_id = ? AND store_id = ?',
            [userId, storeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Rating not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Rating deleted successfully'
        });
    } catch (error) {
        console.error('Delete rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting rating',
            error: error.message
        });
    }
};