const { body } = require('express-validator');
const valid = [
  body('email')
    .notEmpty().withMessage('Email field is required')
    .isEmail().normalizeEmail().withMessage('Field is email type'),
  body('password')
    .notEmpty().withMessage('Password field is required')
    .isLength({
      min: 4
    }).withMessage('Password length must be greater than 3 characters'),
];

module.exports = valid
