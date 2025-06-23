import { body } from 'express-validator';

// Common validation rules
const emailRequired = body('email')
  .exists({ checkFalsy: true })
  .withMessage('Email is required');

const emailValid = body('email')
  .trim()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

const nameRequired = body('name')
  .exists({ checkFalsy: true })
  .withMessage('Name is required');

const nameLength = body('name')
  .isLength({ min: 2, max: 50 })
  .withMessage('Name must be between 2 and 50 characters long');

export const createUserValidation = [
  emailRequired,
  emailValid,
  nameRequired,
  nameLength
];

export const updateUserValidation = [
  emailValid.optional(),
  nameLength.optional()
];