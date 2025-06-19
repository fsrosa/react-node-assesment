import { body } from 'express-validator';
import { TaskStatus, Priority } from '../../models/Task';

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters long'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage('Invalid task status'),

  body('priority')
    .optional()
    .isIn(Object.values(Priority))
    .withMessage('Invalid priority level'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),

  body('userId')
    .optional()
    .isString()
    .withMessage('Invalid user ID format')
];

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters long'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .isIn(Object.values(TaskStatus))
    .withMessage('Invalid task status'),

  body('priority')
    .optional()
    .isIn(Object.values(Priority))
    .withMessage('Invalid priority level'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),

  body('userId')
    .optional()
    .isString()
    .withMessage('Invalid user ID format')
]; 