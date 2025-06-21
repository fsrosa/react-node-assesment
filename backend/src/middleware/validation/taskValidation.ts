import { body } from 'express-validator';
import { TaskStatus, Priority } from '../../models/Task';

// Common validation rules
const titleValidation = body('title')
  .trim()
  .isLength({ min: 3, max: 100 })
  .withMessage('Title must be between 3 and 100 characters long');

const descriptionValidation = body('description')
  .optional()
  .trim()
  .isLength({ max: 500 })
  .withMessage('Description cannot exceed 500 characters');

const statusValidation = body('status')
  .optional()
  .isIn(Object.values(TaskStatus))
  .withMessage('Invalid task status');

const priorityValidation = body('priority')
  .optional()
  .isIn(Object.values(Priority))
  .withMessage('Invalid priority level');

const dueDateValidation = body('dueDate')
  .optional()
  .isISO8601()
  .withMessage('Invalid date format');

const userIdValidation = body('userId')
  .isString()
  .withMessage('Invalid user ID format');

export const createTaskValidation = [
  titleValidation.notEmpty().withMessage('Title is required'),
  descriptionValidation,
  statusValidation,
  priorityValidation,
  dueDateValidation,
  userIdValidation
];

export const updateTaskValidation = [
  titleValidation.optional(),
  descriptionValidation,
  statusValidation,
  priorityValidation,
  dueDateValidation,
  userIdValidation
];