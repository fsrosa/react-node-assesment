import { PrismaClient } from '@prisma/client';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../models/User';

const prisma = new PrismaClient();

export class UserService {
  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    return await prisma.user.create({
      data
    });
  }

  async getAllUsers(): Promise<UserResponse[]> {
    return await prisma.user.findMany({
      include: {
        tasks: true
      }
    });
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        tasks: true
      }
    });
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    return await prisma.user.update({
      where: { id },
      data
    });
  }

  async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id }
    });
  }
} 