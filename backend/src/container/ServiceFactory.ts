import { RepositoryContainer } from './RepositoryContainer';
import { UserService } from '../services/UserService';
import { TaskService } from '../services/TaskService';

export class ServiceFactory {
  private static repositoryContainer = RepositoryContainer.getInstance();

  static createUserService(): UserService {
    return new UserService(this.repositoryContainer.getUserRepository());
  }

  static createTaskService(): TaskService {
    return new TaskService(this.repositoryContainer.getTaskRepository());
  }

  static getRepositoryContainer(): RepositoryContainer {
    return this.repositoryContainer;
  }
} 