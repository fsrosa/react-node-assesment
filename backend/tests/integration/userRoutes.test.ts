import request from 'supertest';
import express from 'express';
import { UserController } from '../../src/controllers/UserController';
import { UserService } from '../../src/services/UserService';
import { validate } from '../../src/middleware/validation';
import { createUserValidation, updateUserValidation } from '../../src/middleware/validation/userValidation';
import { idValidation } from '../../src/middleware/validation/paramValidation';

describe('User Routes Integration Tests', () => {
  let app: express.Application;
  let mockUserService: jest.Mocked<UserService>;
  let userController: UserController;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a fresh Express app for each test
    app = express();
    app.use(express.json());
    
    // Create mock service
    mockUserService = {
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    } as any;
    
    // Create controller with mocked service
    userController = new UserController(mockUserService);
    
    // Set up routes with our mocked controller
    app.post('/api/users', validate(createUserValidation), userController.createUser.bind(userController));
    app.get('/api/users', userController.getAllUsers.bind(userController));
    app.get('/api/users/:id', validate(idValidation), userController.getUserById.bind(userController));
    app.put('/api/users/:id', validate([...idValidation, ...updateUserValidation]), userController.updateUser.bind(userController));
    app.delete('/api/users/:id', validate(idValidation), userController.deleteUser.bind(userController));
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const mockDate = new Date('2025-06-21T18:06:25.033Z');
      const expectedUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: mockDate,
        updatedAt: mockDate
      };

      mockUserService.createUser.mockResolvedValue(expectedUser);

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Convert dates to strings for comparison since Express serializes them
      const expectedResponse = {
        ...expectedUser,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      };

      expect(response.body).toEqual(expectedResponse);
      expect(mockUserService.createUser).toHaveBeenCalledWith(userData);
    });

    it('should return 400 when required fields are missing', async () => {
      const invalidUserData = {
        email: 'test@example.com'
        // Missing name field
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData);

      console.log('Response status:', response.status);
      console.log('Response body:', response.body);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 when email is missing', async () => {
      const invalidUserData = {
        name: 'Test User'
        // Missing email field
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 when email is invalid', async () => {
      const invalidUserData = {
        email: 'invalid-email',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockDate = new Date('2025-06-21T18:06:25.091Z');
      const expectedUsers = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          name: 'User 1',
          createdAt: mockDate,
          updatedAt: mockDate
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          name: 'User 2',
          createdAt: mockDate,
          updatedAt: mockDate
        }
      ];

      mockUserService.getAllUsers.mockResolvedValue(expectedUsers);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      // Convert dates to strings for comparison
      const expectedResponse = expectedUsers.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }));

      expect(response.body).toEqual(expectedResponse);
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
    });

    it('should return empty array when no users exist', async () => {
      mockUserService.getAllUsers.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual([]);
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const userId = 'user-123';
      const mockDate = new Date('2025-06-21T18:06:25.100Z');
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: mockDate,
        updatedAt: mockDate
      };

      mockUserService.getUserById.mockResolvedValue(expectedUser);

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      // Convert dates to strings for comparison
      const expectedResponse = {
        ...expectedUser,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      };

      expect(response.body).toEqual(expectedResponse);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should return 404 when user not found', async () => {
      const userId = 'non-existent';

      mockUserService.getUserById.mockResolvedValue(null);

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
      expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user successfully', async () => {
      const userId = 'user-123';
      const updateData = {
        name: 'Updated Name'
      };

      const mockDate = new Date('2025-06-21T18:06:25.109Z');
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
        createdAt: mockDate,
        updatedAt: mockDate
      };

      mockUserService.updateUser.mockResolvedValue(expectedUser);

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(200);

      // Convert dates to strings for comparison
      const expectedResponse = {
        ...expectedUser,
        createdAt: mockDate.toISOString(),
        updatedAt: mockDate.toISOString()
      };

      expect(response.body).toEqual(expectedResponse);
      expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, updateData);
    });

    it('should return 404 when user not found', async () => {
      const userId = 'non-existent';
      const updateData = {
        name: 'Updated Name'
      };

      mockUserService.updateUser.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
      expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, updateData);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user successfully', async () => {
      const userId = 'user-123';

      mockUserService.deleteUser.mockResolvedValue(true);

      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);

      expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
    });

    it('should return 404 when user not found', async () => {
      const userId = 'non-existent';

      mockUserService.deleteUser.mockResolvedValue(false);

      const response = await request(app)
        .delete(`/api/users/${userId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found');
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(userId);
    });
  });
}); 