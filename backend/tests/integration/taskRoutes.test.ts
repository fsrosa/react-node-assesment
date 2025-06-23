import request from 'supertest';
import express from 'express';
import { TaskController } from '../../src/controllers/TaskController';
import { TaskService } from '../../src/services/TaskService';
import { validate } from '../../src/middleware/validation';
import { createTaskValidation, updateTaskValidation } from '../../src/middleware/validation/taskValidation';
import { idValidation, userIdValidation } from '../../src/middleware/validation/paramValidation';
import { TaskStatus, Priority } from '../../src/models/Task';

describe('Task Routes Integration Tests', () => {
  let app: express.Application;
  let mockTaskService: jest.Mocked<TaskService>;
  let taskController: TaskController;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // Create mock service
    mockTaskService = {
      createTask: jest.fn(),
      getAllTasks: jest.fn(),
      getTaskById: jest.fn(),
      getTasksByUser: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
    } as any;
    
    // Create controller with mocked service
    taskController = new TaskController(mockTaskService);
    
    // Set up routes with our mocked controller
    app.post('/api/tasks', validate(createTaskValidation), taskController.createTask.bind(taskController));
    app.get('/api/tasks', taskController.getAllTasks.bind(taskController));
    app.get('/api/tasks/:id', validate(idValidation), taskController.getTaskById.bind(taskController));
    app.get('/api/tasks/user/:userId', validate(userIdValidation), taskController.getTasksByUser.bind(taskController));
    app.put('/api/tasks/:id', validate([...idValidation, ...updateTaskValidation]), taskController.updateTask.bind(taskController));
    app.delete('/api/tasks/:id', validate(idValidation), taskController.deleteTask.bind(taskController));
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        userId: 'user-123'
      };

      const mockDate = new Date('2025-06-21T18:06:25.030Z');
      const expectedTask = {
        id: 'task-123',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        dueDate: undefined,
        createdAt: mockDate,
        updatedAt: mockDate,
        userId: 'user-123'
      };

      mockTaskService.createTask.mockResolvedValue(expectedTask);

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(201);

      // Convert dates to strings for comparison since Express serializes them
      const expectedResponse = {
        ...expectedTask,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      };

      expect(response.body).toEqual(expectedResponse);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);
    });

    it('should return 400 when required fields are missing', async () => {
      const invalidTaskData = {
        description: 'Test Description'
        // Missing title field
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTaskData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 when status is invalid', async () => {
      const invalidTaskData = {
        title: 'Test Task',
        status: 'INVALID_STATUS'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(invalidTaskData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const mockDate1 = new Date('2025-06-21T18:06:25.088Z');
      const mockDate2 = new Date('2025-06-21T18:06:25.088Z');
      const dueDate2 = new Date('2025-06-21T18:06:25.088Z');
      
      const expectedTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          dueDate: undefined,
          createdAt: mockDate1,
          updatedAt: mockDate1,
          userId: 'user-1'
        },
        {
          id: 'task-2',
          title: 'Task 2',
          description: 'Description 2',
          status: TaskStatus.COMPLETED,
          priority: Priority.HIGH,
          dueDate: dueDate2,
          createdAt: mockDate2,
          updatedAt: mockDate2,
          userId: 'user-2'
        }
      ];

      mockTaskService.getAllTasks.mockResolvedValue(expectedTasks);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      // Convert dates to strings for comparison
      const expectedResponse = expectedTasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
        dueDate: task.dueDate ? task.dueDate.toISOString() : undefined
      }));

      expect(response.body).toEqual(expectedResponse);
      expect(mockTaskService.getAllTasks).toHaveBeenCalled();
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskService.getAllTasks.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(mockTaskService.getAllTasks).toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by id', async () => {
      const taskId = 'task-123';
      const mockDate = new Date('2025-06-21T18:06:25.097Z');
      const expectedTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        dueDate: undefined,
        createdAt: mockDate,
        updatedAt: mockDate,
        userId: 'user-123'
      };

      mockTaskService.getTaskById.mockResolvedValue(expectedTask);

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(200);

      // Convert dates to strings for comparison
      const expectedResponse = {
        ...expectedTask,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      };

      expect(response.body).toEqual(expectedResponse);
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(taskId);
    });

    it('should return 404 when task not found', async () => {
      const taskId = 'non-existent';

      mockTaskService.getTaskById.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('GET /api/tasks/user/:userId', () => {
    it('should return tasks for a specific user', async () => {
      const userId = 'user-123';
      const mockDate = new Date('2025-06-21T18:06:25.100Z');
      const expectedTasks = [
        {
          id: 'task-1',
          title: 'User Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          dueDate: undefined,
          createdAt: mockDate,
          updatedAt: mockDate,
          userId: userId
        }
      ];

      mockTaskService.getTasksByUser.mockResolvedValue(expectedTasks);

      const response = await request(app)
        .get(`/api/tasks/user/${userId}`)
        .expect(200);

      // Convert dates to strings for comparison
      const expectedResponse = expectedTasks.map(task => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      }));

      expect(response.body).toEqual(expectedResponse);
      expect(mockTaskService.getTasksByUser).toHaveBeenCalledWith(userId);
    });

    it('should return empty array when user has no tasks', async () => {
      const userId = 'user-123';

      mockTaskService.getTasksByUser.mockResolvedValue([]);

      const response = await request(app)
        .get(`/api/tasks/user/${userId}`)
        .expect(200);

      expect(response.body).toEqual([]);
      expect(mockTaskService.getTasksByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task successfully', async () => {
      const taskId = 'task-123';
      const updateData = {
        title: 'Updated Task',
        status: TaskStatus.COMPLETED
      };

      const mockDate = new Date('2025-06-21T18:06:25.109Z');
      const expectedTask = {
        id: taskId,
        title: 'Updated Task',
        description: 'Test Description',
        status: TaskStatus.COMPLETED,
        priority: Priority.MEDIUM,
        dueDate: undefined,
        createdAt: mockDate,
        updatedAt: mockDate,
        userId: 'user-123'
      };

      mockTaskService.updateTask.mockResolvedValue(expectedTask);

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(200);

      // Convert dates to strings for comparison
      const expectedResponse = {
        ...expectedTask,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      };

      expect(response.body).toEqual(expectedResponse);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(taskId, updateData);
    });

    it('should return 404 when task not found', async () => {
      const taskId = 'non-existent';
      const updateData = {
        title: 'Updated Task'
      };

      mockTaskService.updateTask.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
      expect(mockTaskService.updateTask).toHaveBeenCalledWith(taskId, updateData);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task successfully', async () => {
      const taskId = 'task-123';

      mockTaskService.deleteTask.mockResolvedValue(true);

      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(204);

      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(taskId);
    });

    it('should return 404 when task not found', async () => {
      const taskId = 'non-existent';

      mockTaskService.deleteTask.mockResolvedValue(false);

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });
}); 