import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { validate } from '../middleware/validation';
import { createTaskValidation, updateTaskValidation } from '../middleware/validation/taskValidation';
import { idValidation, userIdValidation } from '../middleware/validation/paramValidation';

const router = Router();
const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.post(
  '/',
  validate(createTaskValidation),
  taskController.createTask.bind(taskController)
);

router.get(
  '/',
  taskController.getAllTasks.bind(taskController)
);

router.get(
  '/:id',
  validate(idValidation),
  taskController.getTaskById.bind(taskController)
);

router.get(
  '/user/:userId',
  validate(userIdValidation),
  taskController.getTasksByUser.bind(taskController)
);

router.put(
  '/:id',
  validate([...idValidation, ...updateTaskValidation]),
  taskController.updateTask.bind(taskController)
);

router.delete(
  '/:id',
  validate(idValidation),
  taskController.deleteTask.bind(taskController)
);

export default router; 