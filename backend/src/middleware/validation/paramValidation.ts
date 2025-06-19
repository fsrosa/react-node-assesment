import { param } from 'express-validator';

export const idValidation = [
  param('id')
    .notEmpty()
    .withMessage('ID is required')
    .isString()
    .withMessage('Invalid ID format')
];

export const userIdValidation = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isString()
    .withMessage('Invalid user ID format')
]; 