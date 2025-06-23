import { TaskService } from '../../../src/services/TaskService';
import { CreateTaskRequest, UpdateTaskRequest, TaskStatus, Priority } from '../../../src/models/Task';

describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTaskRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findTasksWithUsers: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    taskService = new TaskService(mockTaskRepository);
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData: CreateTaskRequest = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        userId: 'user-123'
      };

      const expectedTask = {
        id: 'task-123',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        dueDate: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-123'
      };

      mockTaskRepository.create.mockResolvedValue(expectedTask);

      const result = await taskService.createTask(taskData);

      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(expectedTask);
    });

    it('should throw an error when repository fails', async () => {
      const taskData: CreateTaskRequest = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        userId: 'user-123'
      };

      mockTaskRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(taskService.createTask(taskData)).rejects.toThrow('Database error');
      expect(mockTaskRepository.create).toHaveBeenCalledWith(taskData);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const expectedTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          dueDate: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-1'
        },
        {
          id: 'task-2',
          title: 'Task 2',
          description: 'Description 2',
          status: TaskStatus.COMPLETED,
          priority: Priority.HIGH,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user-2'
        }
      ];

      mockTaskRepository.findTasksWithUsers.mockResolvedValue(expectedTasks);

      const result = await taskService.getAllTasks();

      expect(mockTaskRepository.findTasksWithUsers).toHaveBeenCalled();
      expect(result).toEqual(expectedTasks);
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskRepository.findTasksWithUsers.mockResolvedValue([]);

      const result = await taskService.getAllTasks();

      expect(mockTaskRepository.findTasksWithUsers).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const taskId = 'task-123';
      const expectedTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        dueDate: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-123'
      };

      mockTaskRepository.findById.mockResolvedValue(expectedTask);

      const result = await taskService.getTaskById(taskId);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(expectedTask);
    });

    it('should return null when task not found', async () => {
      const taskId = 'non-existent';

      mockTaskRepository.findById.mockResolvedValue(null);

      const result = await taskService.getTaskById(taskId);

      expect(mockTaskRepository.findById).toHaveBeenCalledWith(taskId);
      expect(result).toBeNull();
    });
  });

  describe('getTasksByUser', () => {
    it('should return tasks for a specific user', async () => {
      const userId = 'user-123';
      const allTasks = [
        {
          id: 'task-1',
          title: 'User Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          dueDate: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId
        },
        {
          id: 'task-2',
          title: 'Other User Task',
          description: 'Description 2',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          dueDate: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'other-user'
        }
      ];

      mockTaskRepository.findTasksWithUsers.mockResolvedValue(allTasks);

      const result = await taskService.getTasksByUser(userId);

      expect(mockTaskRepository.findTasksWithUsers).toHaveBeenCalled();
      expect(result).toEqual([allTasks[0]]); // Only the task for the specific user
    });

    it('should return empty array when user has no tasks', async () => {
      const userId = 'user-123';
      const allTasks = [
        {
          id: 'task-1',
          title: 'Other User Task',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          dueDate: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'other-user'
        }
      ];

      mockTaskRepository.findTasksWithUsers.mockResolvedValue(allTasks);

      const result = await taskService.getTasksByUser(userId);

      expect(mockTaskRepository.findTasksWithUsers).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      const taskId = 'task-123';
      const updateData: UpdateTaskRequest = {
        title: 'Updated Task',
        status: TaskStatus.COMPLETED
      };

      const expectedTask = {
        id: taskId,
        title: 'Updated Task',
        description: 'Test Description',
        status: TaskStatus.COMPLETED,
        priority: Priority.MEDIUM,
        dueDate: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-123'
      };

      mockTaskRepository.update.mockResolvedValue(expectedTask);

      const result = await taskService.updateTask(taskId, updateData);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updateData);
      expect(result).toEqual(expectedTask);
    });

    it('should return null when task not found', async () => {
      const taskId = 'non-existent';
      const updateData: UpdateTaskRequest = {
        title: 'Updated Task'
      };

      mockTaskRepository.update.mockResolvedValue(null);

      const result = await taskService.updateTask(taskId, updateData);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, updateData);
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const taskId = 'task-123';

      mockTaskRepository.delete.mockResolvedValue(true);

      const result = await taskService.deleteTask(taskId);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
      expect(result).toBe(true);
    });

    it('should return false when task not found', async () => {
      const taskId = 'non-existent';

      mockTaskRepository.delete.mockResolvedValue(false);

      const result = await taskService.deleteTask(taskId);

      expect(mockTaskRepository.delete).toHaveBeenCalledWith(taskId);
      expect(result).toBe(false);
    });
  });
}); 