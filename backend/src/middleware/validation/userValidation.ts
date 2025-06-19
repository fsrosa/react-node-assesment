import { body } from 'express-validator';

export const createUserValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
];

export const updateUserValidation = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
]; 