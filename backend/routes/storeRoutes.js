const express = require('express');
const router = express.Router();
const {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore
} = require('../controllers/storeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { storeValidationRules, validate } = require('../utils/validators');

// Protected routes - accessible by all authenticated users
router.use(protect);

// Get all stores and single store - accessible by all users
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Admin-only routes
router.post('/', authorize('Admin'), storeValidationRules, validate, createStore);
router.put('/:id', authorize('Admin'), storeValidationRules, validate, updateStore);
router.delete('/:id', authorize('Admin'), deleteStore);

module.exports = router;