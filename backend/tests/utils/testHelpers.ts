import { PrismaClient } from '@prisma/client';

export const createMockPrismaClient = () => {
  return {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaClient;
};

export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockTask = (overrides = {}) => ({
  id: 'task-123',
  title: 'Test Task',
  description: 'Test Description',
  status: 'PENDING',
  priority: 'MEDIUM',
  dueDate: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: 'user-123',
  ...overrides,
});

export const createMockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  ...overrides,
});

export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = () => jest.fn();

export const clearAllMocks = () => {
  jest.clearAllMocks();
};

export const mockValidationResult = (isEmpty: boolean, errors: any[] = []) => ({
  isEmpty: () => isEmpty,
  array: () => errors,
}); 