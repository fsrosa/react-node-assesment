import { PrismaClient } from '@prisma/client';
import { CreateTaskRequest, UpdateTaskRequest, TaskResponse } from '../models/Task';

const prisma = new PrismaClient();

export class TaskService {
  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    // Convert dueDate string to Date object if provided
    const createData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined
    };

    const result = await prisma.task.create({
      data: createData,
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

    return result as TaskResponse;
  }

  async getAllTasks(): Promise<TaskResponse[]> {
    const results = await prisma.task.findMany({
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

    return results as TaskResponse[];
  }

  async getTaskById(id: string): Promise<TaskResponse | null> {
    const result = await prisma.task.findUnique({
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

    return result as TaskResponse | null;
  }

  async getTasksByUser(userId: string): Promise<TaskResponse[]> {
    const results = await prisma.task.findMany({
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

    return results as TaskResponse[];
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    // Convert dueDate string to Date object if provided
    const updateData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined
    };

    const result = await prisma.task.update({
      where: { id },
      data: updateData,
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

    return result as TaskResponse;
  }

  async deleteTask(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id }
    });
  }
} 