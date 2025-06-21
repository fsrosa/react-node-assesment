export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  userId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: Date;
  userId?: string;
}

// Repository-specific DTOs that accept string dates
export interface CreateTaskRepositoryRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
  userId?: string;
}

export interface UpdateTaskRepositoryRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
  userId?: string;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
} 