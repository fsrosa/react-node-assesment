import { IBaseRepository } from './IBaseRepository';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../../models/User';

export interface IUserRepository extends IBaseRepository<UserResponse, CreateUserRequest, UpdateUserRequest> {
  findByEmail(email: string): Promise<UserResponse | null>;
  findUsersWithTasks(): Promise<UserResponse[]>;
} 