import { ITaskRepository } from '../repositories/interfaces/ITaskRepository';
import { CreateTaskRequest, UpdateTaskRequest, TaskResponse, TaskStatus, Priority } from '../models/Task';

export class TaskService {
  private taskRepository: ITaskRepository;

  constructor(taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    // Convert dueDate string to Date object if provided
    const createData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined
    };

    return await this.taskRepository.create(createData);
  }

  async getAllTasks(): Promise<TaskResponse[]> {
    return await this.taskRepository.findAll();
  }

  async getTaskById(id: string): Promise<TaskResponse | null> {
    return await this.taskRepository.findById(id);
  }

  async getTasksByUser(userId: string): Promise<TaskResponse[]> {
    return await this.taskRepository.findByUserId(userId);
  }

  async getTasksByStatus(status: TaskStatus): Promise<TaskResponse[]> {
    return await this.taskRepository.findByStatus(status);
  }

  async getTasksByPriority(priority: Priority): Promise<TaskResponse[]> {
    return await this.taskRepository.findByPriority(priority);
  }

  async getOverdueTasks(): Promise<TaskResponse[]> {
    return await this.taskRepository.findOverdueTasks();
  }

  async getTasksWithUsers(): Promise<TaskResponse[]> {
    return await this.taskRepository.findTasksWithUsers();
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse | null> {
    // Convert dueDate string to Date object if provided
    const updateData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined
    };

    return await this.taskRepository.update(id, updateData);
  }

  async deleteTask(id: string): Promise<boolean> {
    return await this.taskRepository.delete(id);
  }
} 