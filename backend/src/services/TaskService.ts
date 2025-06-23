import { ITaskRepository } from '../repositories/interfaces/ITaskRepository';
import { CreateTaskRequest, UpdateTaskRequest, TaskResponse, TaskStatus, Priority } from '../models/Task';
import { eventService } from './EventService';

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

    const task = await this.taskRepository.create(createData);
    eventService.broadcastTaskChange('CREATE', task);
    return task;
  }

  async getAllTasks(): Promise<TaskResponse[]> {
    return await this.taskRepository.findTasksWithUsers();
  }

  async getTaskById(id: string): Promise<TaskResponse | null> {
    return await this.taskRepository.findById(id);
  }

  async getTasksByUser(userId: string): Promise<TaskResponse[]> {
    const allTasksWithUsers = await this.taskRepository.findTasksWithUsers();
    return allTasksWithUsers.filter(task => task.userId === userId);
  }

  async getTasksByStatus(status: TaskStatus): Promise<TaskResponse[]> {
    const allTasksWithUsers = await this.taskRepository.findTasksWithUsers();
    return allTasksWithUsers.filter(task => task.status === status);
  }

  async getTasksByPriority(priority: Priority): Promise<TaskResponse[]> {
    const allTasksWithUsers = await this.taskRepository.findTasksWithUsers();
    return allTasksWithUsers.filter(task => task.priority === priority);
  }

  async getOverdueTasks(): Promise<TaskResponse[]> {
    const allTasksWithUsers = await this.taskRepository.findTasksWithUsers();
    const now = new Date();
    return allTasksWithUsers.filter(task => 
      task.dueDate && new Date(task.dueDate) < now && task.status !== 'COMPLETED'
    );
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

    const task = await this.taskRepository.update(id, updateData);
    if (task) {
      eventService.broadcastTaskChange('UPDATE', task);
    }
    return task;
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = await this.taskRepository.findById(id);
    const deleted = await this.taskRepository.delete(id);
    if (deleted && task) {
      eventService.broadcastTaskChange('DELETE', task);
    }
    return deleted;
  }
} 