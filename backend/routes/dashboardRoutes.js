const express = require('express');
const router = express.Router();
const {
    getAdminDashboard,
    getStoreOwnerDashboard
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Protected routes
router.use(protect);

// Admin dashboard
router.get('/admin', authorize('Admin'), getAdminDashboard);

// Store owner dashboard
router.get('/store-owner', authorize('store_owner'), getStoreOwnerDashboard);

module.exports = router;