import { PrismaClient } from '@prisma/client';
import { CreateTaskRequest, UpdateTaskRequest, TaskResponse } from '../models/Task';

const prisma = new PrismaClient();

export class TaskService {
  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    return await prisma.task.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getAllTasks(): Promise<TaskResponse[]> {
    return await prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getTaskById(id: string): Promise<TaskResponse | null> {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async getTasksByUser(userId: string): Promise<TaskResponse[]> {
    return await prisma.task.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    return await prisma.task.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
  }

  async deleteTask(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id }
    });
  }
} 