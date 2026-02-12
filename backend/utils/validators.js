const { body, validationResult } = require('express-validator');

// Validation middleware wrapper
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// User validation rules
const userValidationRules = [
    body('name')
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage('Name must be between 20 and 60 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter and one special character'),

    body('address')
        .optional()
        .trim()
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters')
];

// Store validation rules
const storeValidationRules = [
    body('name')
        .trim()
        .isLength({ min: 20, max: 60 })
        .withMessage('Store name must be between 20 and 60 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('address')
        .trim()
        .isLength({ max: 400 })
        .withMessage('Address must not exceed 400 characters')
];

// Rating validation rules
const ratingValidationRules = [
    body('storeId')
        .isInt({ min: 1 })
        .withMessage('Valid store ID is required'),

    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5')
];

// Password update validation
const passwordValidationRules = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 8, max: 16 })
        .withMessage('Password must be between 8 and 16 characters')
        .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one uppercase letter and one special character')
];

module.exports = {
    validate,
    userValidationRules,
    storeValidationRules,
    ratingValidationRules,
    passwordValidationRules
};