import { PrismaClient } from '@prisma/client';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { CreateTaskRepositoryRequest, UpdateTaskRepositoryRequest, TaskResponse, TaskStatus, Priority } from '../../models/Task';

export class PrismaTaskRepository implements ITaskRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll(): Promise<TaskResponse[]> {
    const tasks = await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined
    }));
  }

  async findById(id: string): Promise<TaskResponse | null> {
    const task = await this.prisma.task.findUnique({
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

    if (!task) return null;

    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined,
      user: task.user ? {
        id: task.user.id,
        name: task.user.name,
        email: task.user.email
      } : undefined
    };
  }

  async findByUserId(userId: string): Promise<TaskResponse[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined
    }));
  }

  async findByStatus(status: TaskStatus): Promise<TaskResponse[]> {
    const tasks = await this.prisma.task.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined
    }));
  }

  async findByPriority(priority: Priority): Promise<TaskResponse[]> {
    const tasks = await this.prisma.task.findMany({
      where: { priority },
      orderBy: { createdAt: 'desc' }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined
    }));
  }

  async findOverdueTasks(): Promise<TaskResponse[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          lt: new Date()
        },
        status: {
          not: 'COMPLETED'
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined
    }));
  }

  async findTasksWithUsers(): Promise<TaskResponse[]> {
    const tasks = await this.prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined,
      user: task.user ? {
        id: task.user.id,
        name: task.user.name,
        email: task.user.email
      } : undefined
    }));
  }

  async create(data: CreateTaskRepositoryRequest): Promise<TaskResponse> {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'PENDING',
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate,
        userId: data.userId
      },
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

    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined,
      user: task.user ? {
        id: task.user.id,
        name: task.user.name,
        email: task.user.email
      } : undefined
    };
  }

  async update(id: string, data: UpdateTaskRepositoryRequest): Promise<TaskResponse | null> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.dueDate && { dueDate: data.dueDate }),
        ...(data.userId && { userId: data.userId })
      },
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

    return {
      id: task.id,
      title: task.title,
      description: task.description || undefined,
      status: task.status as TaskStatus,
      priority: task.priority as Priority,
      dueDate: task.dueDate || undefined,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      userId: task.userId || undefined,
      user: task.user ? {
        id: task.user.id,
        name: task.user.name,
        email: task.user.email
      } : undefined
    };
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.task.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
} 