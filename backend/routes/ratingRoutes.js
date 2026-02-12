const express = require('express');
const router = express.Router();
const {
    submitRating,
    getMyStoreRatings,
    getUserRatingForStore,
    deleteRating
} = require('../controllers/ratingController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { ratingValidationRules, validate } = require('../utils/validators');

// Protected routes
router.use(protect);

// User routes - submit/update rating
router.post('/', authorize('user'), ratingValidationRules, validate, submitRating);
router.get('/store/:storeId', authorize('user'), getUserRatingForStore);
router.delete('/store/:storeId', authorize('user'), deleteRating);

// Store owner routes - view ratings for their store
router.get('/my-store', authorize('store_owner'), getMyStoreRatings);

module.exports = router;