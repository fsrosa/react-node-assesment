import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/User';

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    return await this.userRepository.create(data);
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<UserResponse | null> {
    return await this.userRepository.findByEmail(email);
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse | null> {
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async getUsersWithTasks(): Promise<UserResponse[]> {
    return await this.userRepository.findUsersWithTasks();
  }
} 