import { body } from 'express-validator';

// Common validation rules
const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

const nameValidation = body('name')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters long');

export const createUserValidation = [
  emailValidation,
  nameValidation.notEmpty().withMessage('Name is required')
];

export const updateUserValidation = [
  emailValidation.optional(),
  nameValidation.optional()
];