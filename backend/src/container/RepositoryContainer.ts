import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ITaskRepository } from '../repositories/interfaces/ITaskRepository';
import { PrismaUserRepository } from '../repositories/implementations/PrismaUserRepository';
import { PrismaTaskRepository } from '../repositories/implementations/PrismaTaskRepository';

export class RepositoryContainer {
  private static instance: RepositoryContainer;
  private prisma: PrismaClient;
  private userRepository: IUserRepository;
  private taskRepository: ITaskRepository;

  private constructor() {
    this.prisma = new PrismaClient();
    this.userRepository = new PrismaUserRepository(this.prisma);
    this.taskRepository = new PrismaTaskRepository(this.prisma);
  }

  public static getInstance(): RepositoryContainer {
    if (!RepositoryContainer.instance) {
      RepositoryContainer.instance = new RepositoryContainer();
    }
    return RepositoryContainer.instance;
  }

  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  public getTaskRepository(): ITaskRepository {
    return this.taskRepository;
  }

  public getPrismaClient(): PrismaClient {
    return this.prisma;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
} 