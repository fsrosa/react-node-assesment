import { IBaseRepository } from './IBaseRepository';
import { CreateTaskRepositoryRequest, UpdateTaskRepositoryRequest, TaskResponse, TaskStatus, Priority } from '../../models/Task';

export interface ITaskRepository extends IBaseRepository<TaskResponse, CreateTaskRepositoryRequest, UpdateTaskRepositoryRequest> {
  findByUserId(userId: string): Promise<TaskResponse[]>;
  findByStatus(status: TaskStatus): Promise<TaskResponse[]>;
  findByPriority(priority: Priority): Promise<TaskResponse[]>;
  findOverdueTasks(): Promise<TaskResponse[]>;
  findTasksWithUsers(): Promise<TaskResponse[]>;
} 