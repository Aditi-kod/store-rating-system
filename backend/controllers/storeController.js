const bcrypt = require('bcrypt');
const db = require('../config/database');

// @desc    Get all stores (with filtering, sorting, and ratings)
// @route   GET /api/stores
// @access  Private
exports.getAllStores = async (req, res) => {
    try {
        const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
        const userId = req.user.id;

        let query = `
      SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as total_ratings,
        ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
      WHERE 1=1
    `;
        const params = [userId];

        // Apply filters
        if (name) {
            query += ' AND s.name LIKE ?';
            params.push(`%${name}%`);
        }
        if (address) {
            query += ' AND s.address LIKE ?';
            params.push(`%${address}%`);
        }

        query += ' GROUP BY s.id, s.name, s.email, s.address, ur.rating';

        // Apply sorting
        const allowedSortFields = ['name', 'email', 'address', 'average_rating'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
        const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        if (sortField === 'average_rating') {
            query += ` ORDER BY average_rating ${order}`;
        } else {
            query += ` ORDER BY s.${sortField} ${order}`;
        }

        const [stores] = await db.query(query, params);

        res.status(200).json({
            success: true,
            count: stores.length,
            data: stores
        });
    } catch (error) {
        console.error('Get all stores error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stores',
            error: error.message
        });
    }
};

// @desc    Get single store by ID
// @route   GET /api/stores/:id
// @access  Private
exports.getStoreById = async (req, res) => {
    try {
        const userId = req.user.id;

        const [stores] = await db.query(
            `SELECT 
        s.id, 
        s.name, 
        s.email, 
        s.address,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as total_ratings,
        ur.rating as user_rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = ?
       WHERE s.id = ?
       GROUP BY s.id, s.name, s.email, s.address, ur.rating`,
            [userId, req.params.id]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        res.status(200).json({
            success: true,
            data: stores[0]
        });
    } catch (error) {
        console.error('Get store by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching store',
            error: error.message
        });
    }
};

// @desc    Create new store
// @route   POST /api/stores
// @access  Private/Admin
exports.createStore = async (req, res) => {
    try {
        const { name, email, address, ownerName, ownerPassword } = req.body;

        // Check if store email already exists
        const [existingStores] = await db.query(
            'SELECT id FROM stores WHERE email = ?',
            [email]
        );

        if (existingStores.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Store with this email already exists'
            });
        }

        // Insert store
        const [storeResult] = await db.query(
            'INSERT INTO stores (name, email, address) VALUES (?, ?, ?)',
            [name, email, address]
        );

        const storeId = storeResult.insertId;

        // Create store owner account if provided
        if (ownerName && ownerPassword) {
            const hashedPassword = await bcrypt.hash(ownerPassword, 10);

            await db.query(
                'INSERT INTO users (name, email, password, address, role, store_id) VALUES (?, ?, ?, ?, ?, ?)',
                [ownerName, email, hashedPassword, address, 'store_owner', storeId]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Store created successfully',
            data: {
                id: storeId,
                name,
                email,
                address
            }
        });
    } catch (error) {
        console.error('Create store error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating store',
            error: error.message
        });
    }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private/Admin
exports.updateStore = async (req, res) => {
    try {
        const { name, email, address } = req.body;

        // Check if store exists
        const [stores] = await db.query(
            'SELECT id FROM stores WHERE id = ?',
            [req.params.id]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Update store
        await db.query(
            'UPDATE stores SET name = ?, email = ?, address = ? WHERE id = ?',
            [name, email, address, req.params.id]
        );

        res.status(200).json({
            success: true,
            message: 'Store updated successfully'
        });
    } catch (error) {
        console.error('Update store error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating store',
            error: error.message
        });
    }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private/Admin
exports.deleteStore = async (req, res) => {
    try {
        // Check if store exists
        const [stores] = await db.query(
            'SELECT id FROM stores WHERE id = ?',
            [req.params.id]
        );

        if (stores.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        // Delete store (cascade will delete related ratings)
        await db.query('DELETE FROM stores WHERE id = ?', [req.params.id]);

        res.status(200).json({
            success: true,
            message: 'Store deleted successfully'
        });
    } catch (error) {
        console.error('Delete store error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting store',
            error: error.message
        });
    }
};