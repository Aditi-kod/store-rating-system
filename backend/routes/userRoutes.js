const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { userValidationRules, validate } = require('../utils/validators');

// All routes are protected and Admin-only
router.use(protect);
router.use(authorize('Admin'));

router.route('/')
    .get(getAllUsers)
    .post(userValidationRules, validate, createUser);

router.route('/:id')
    .get(getUserById)
    .delete(deleteUser);

module.exports = router;