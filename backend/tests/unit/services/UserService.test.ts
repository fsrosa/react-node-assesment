import { UserService } from '../../../src/services/UserService';
import { CreateUserRequest, UpdateUserRequest } from '../../../src/models/User';

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      const expectedUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.create.mockResolvedValue(expectedUser);

      const result = await userService.createUser(userData);

      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expectedUser);
    });

    it('should throw an error when repository fails', async () => {
      const userData: CreateUserRequest = {
        email: 'test@example.com',
        name: 'Test User'
      };

      mockUserRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(userService.createUser(userData)).rejects.toThrow('Database error');
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          name: 'User 1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          name: 'User 2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      mockUserRepository.findAll.mockResolvedValue(expectedUsers);

      const result = await userService.getAllUsers();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedUsers);
    });

    it('should return empty array when no users exist', async () => {
      mockUserRepository.findAll.mockResolvedValue([]);

      const result = await userService.getAllUsers();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const userId = 'user-123';
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findById.mockResolvedValue(expectedUser);

      const result = await userService.getUserById(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found', async () => {
      const userId = 'non-existent';

      mockUserRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userId = 'user-123';
      const updateData: UpdateUserRequest = {
        name: 'Updated Name'
      };

      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Updated Name',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.update.mockResolvedValue(expectedUser);

      const result = await userService.updateUser(userId, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(expectedUser);
    });

    it('should return null when user not found', async () => {
      const userId = 'non-existent';
      const updateData: UpdateUserRequest = {
        name: 'Updated Name'
      };

      mockUserRepository.update.mockResolvedValue(null);

      const result = await userService.updateUser(userId, updateData);

      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updateData);
      expect(result).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = 'user-123';

      mockUserRepository.delete.mockResolvedValue(true);

      const result = await userService.deleteUser(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('should return false when user not found', async () => {
      const userId = 'non-existent';

      mockUserRepository.delete.mockResolvedValue(false);

      const result = await userService.deleteUser(userId);

      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toBe(false);
    });
  });
}); 