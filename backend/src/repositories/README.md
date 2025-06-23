# Repository Pattern Implementation

This directory contains the implementation of the Repository Pattern for the backend application. The repository pattern provides an abstraction layer between the business logic and data access logic.

## Structure

```
repositories/
├── interfaces/           # Repository interfaces
│   ├── IBaseRepository.ts
│   ├── IUserRepository.ts
│   ├── ITaskRepository.ts
│   └── index.ts
├── implementations/      # Concrete repository implementations
│   ├── PrismaUserRepository.ts
│   ├── PrismaTaskRepository.ts
│   └── index.ts
└── index.ts             # Main exports
```

## Components

### 1. Base Repository Interface (`IBaseRepository.ts`)

Defines common CRUD operations that all repositories must implement:

- `findAll()`: Retrieve all entities
- `findById(id)`: Find entity by ID
- `create(data)`: Create new entity
- `update(id, data)`: Update existing entity
- `delete(id)`: Delete entity

### 2. Specific Repository Interfaces

#### `IUserRepository.ts`
Extends the base repository and adds user-specific methods:
- `findByEmail(email)`: Find user by email
- `findUsersWithTasks()`: Get users with their associated tasks

#### `ITaskRepository.ts`
Extends the base repository and adds task-specific methods:
- `findByUserId(userId)`: Find tasks by user ID
- `findByStatus(status)`: Find tasks by status
- `findByPriority(priority)`: Find tasks by priority
- `findOverdueTasks()`: Find overdue tasks
- `findTasksWithUsers()`: Get tasks with user information

### 3. Repository Implementations

#### `PrismaUserRepository.ts`
Concrete implementation using Prisma ORM for user operations.

#### `PrismaTaskRepository.ts`
Concrete implementation using Prisma ORM for task operations.

## Usage

### 1. Using the Repository Container

```typescript
import { RepositoryContainer } from '../container/RepositoryContainer';

// Get repository container instance
const repositoryContainer = RepositoryContainer.getInstance();

// Get repositories
const userRepository = repositoryContainer.getUserRepository();
const taskRepository = repositoryContainer.getTaskRepository();

// Use repositories
const users = await userRepository.findAll();
const tasks = await taskRepository.findByUserId('user-id');
```

### 2. Using Services with Repositories

```typescript
import { UserService } from '../services/UserService';
import { RepositoryContainer } from '../container/RepositoryContainer';

const repositoryContainer = RepositoryContainer.getInstance();
const userService = new UserService(repositoryContainer.getUserRepository());

// Use service methods
const users = await userService.getAllUsers();
const user = await userService.createUser({ name: 'John', email: 'john@example.com' });
```

### 3. Using the Service Factory

```typescript
import { ServiceFactory } from '../container/ServiceFactory';

const userService = ServiceFactory.createUserService();
const taskService = ServiceFactory.createTaskService();

// Use services
const users = await userService.getAllUsers();
const tasks = await taskService.getAllTasks();
```

## Benefits

1. **Separation of Concerns**: Business logic is separated from data access logic
2. **Testability**: Easy to mock repositories for unit testing
3. **Flexibility**: Can easily switch between different data sources
4. **Maintainability**: Centralized data access logic
5. **Type Safety**: Strong typing with TypeScript interfaces

## Adding New Repositories

1. Create a new interface extending `IBaseRepository`
2. Implement the interface with a concrete class
3. Add the repository to the `RepositoryContainer`
4. Create corresponding service methods
5. Update the `ServiceFactory` if needed

## Example: Adding a New Repository

```typescript
// 1. Create interface
export interface IProjectRepository extends IBaseRepository<Project, CreateProject, UpdateProject> {
  findByStatus(status: ProjectStatus): Promise<Project[]>;
}

// 2. Implement repository
export class PrismaProjectRepository implements IProjectRepository {
  // Implementation...
}

// 3. Add to container
export class RepositoryContainer {
  private projectRepository: IProjectRepository;
  
  constructor() {
    this.projectRepository = new PrismaProjectRepository(this.prisma);
  }
  
  public getProjectRepository(): IProjectRepository {
    return this.projectRepository;
  }
}
``` 