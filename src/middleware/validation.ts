import { body } from 'express-validator';

export const videoValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('duration').notEmpty().withMessage('Description is required').trim(),
  body('duration').isInt({ min: 0 }).withMessage('Duration must be a positive number'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('tags').isArray().withMessage('Tags must be an array')
];

export const authValidation = {
  register: [
      body('name')
          .trim()
          .notEmpty().withMessage('Name is required')
          .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
      
      body('email')
          .trim()
          .notEmpty().withMessage('Email is required')
          .isEmail().withMessage('Invalid email format')
          .normalizeEmail(),
      
      body('password')
          .notEmpty().withMessage('Password is required')
          .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
          .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
          .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
          .matches(/[0-9]/).withMessage('Password must contain at least one number')
          .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character'),
  ],

  login: [
      body('email')
          .trim()
          .notEmpty().withMessage('Email is required')
          .isEmail().withMessage('Invalid email format')
          .normalizeEmail(),
      
      body('password')
          .notEmpty().withMessage('Password is required'),
  ]
};