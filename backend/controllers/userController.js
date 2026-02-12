const bcrypt = require('bcrypt');
const db = require('../config/database');

// @desc    Get all users (with filtering and sorting)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;

        let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.store_id,
             s.name as store_name,
             COALESCE(AVG(r.rating), 0) as average_rating
      FROM users u
      LEFT JOIN stores s ON u.store_id = s.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
        const params = [];

        // Apply filters
        if (name) {
            query += ' AND u.name LIKE ?';
            params.push(`%${name}%`);
        }
        if (email) {
            query += ' AND u.email LIKE ?';
            params.push(`%${email}%`);
        }
        if (address) {
            query += ' AND u.address LIKE ?';
            params.push(`%${address}%`);
        }
        if (role) {
            query += ' AND u.role = ?';
            params.push(role);
        }

        query += ' GROUP BY u.id, u.name, u.email, u.address, u.role, u.store_id, s.name';

        // Apply sorting
        const allowedSortFields = ['name', 'email', 'address', 'role'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
        const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY u.${sortField} ${order}`;

        const [users] = await db.query(query, params);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Get single User by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.id, u.name, u.email, u.address, u.role, u.store_id,
              s.name as store_name,
              COALESCE(AVG(r.rating), 0) as average_rating
       FROM users u
       LEFT JOIN stores s ON u.store_id = s.id
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE u.id = ?
       GROUP BY u.id, u.name, u.email, u.address, u.role, u.store_id, s.name`,
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: users[0]
        });
    } catch (error) {
        console.error('Get User by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching User',
            error: error.message
        });
    }
};

// @desc    Create new User (by Admin)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // Check if User already exists
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Validate role
        const validRoles = ['Admin', 'user', 'store_owner'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be Admin, User, or store_owner'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new User
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, address, role]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                id: result.insertId,
                name,
                email,
                role
            }
        });
    } catch (error) {
        console.error('Create User error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating User',
            error: error.message
        });
    }
};

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        // Check if User exists
        const [users] = await db.query(
            'SELECT id FROM users WHERE id = ?',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Delete User
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete User error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting User',
            error: error.message
        });
    }
};