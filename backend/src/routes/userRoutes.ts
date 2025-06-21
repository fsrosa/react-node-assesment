import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { RepositoryContainer } from '../container/RepositoryContainer';
import { validate } from '../middleware/validation';
import { createUserValidation, updateUserValidation } from '../middleware/validation/userValidation';
import { idValidation } from '../middleware/validation/paramValidation';

const router = Router();

// Get repository container instance
const repositoryContainer = RepositoryContainer.getInstance();

// Create service with repository dependency
const userService = new UserService(repositoryContainer.getUserRepository());
const userController = new UserController(userService);

router.post(
  '/',
  validate(createUserValidation),
  userController.createUser.bind(userController)
);

router.get(
  '/',
  userController.getAllUsers.bind(userController)
);

router.get(
  '/:id',
  validate(idValidation),
  userController.getUserById.bind(userController)
);

router.put(
  '/:id',
  validate([...idValidation, ...updateUserValidation]),
  userController.updateUser.bind(userController)
);

router.delete(
  '/:id',
  validate(idValidation),
  userController.deleteUser.bind(userController)
);

export default router; 