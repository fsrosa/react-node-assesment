import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/User';
import { eventService } from './EventService';

export class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const user = await this.userRepository.create(data);
    eventService.broadcastUserChange('CREATE', user);
    return user;
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
    const user = await this.userRepository.update(id, data);
    if (user) {
      eventService.broadcastUserChange('UPDATE', user);
    }
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.findById(id);
    const deleted = await this.userRepository.delete(id);
    if (deleted && user) {
      eventService.broadcastUserChange('DELETE', user);
    }
    return deleted;
  }

  async getUsersWithTasks(): Promise<UserResponse[]> {
    return await this.userRepository.findUsersWithTasks();
  }
} 