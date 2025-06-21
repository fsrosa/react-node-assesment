import { Request, Response } from 'express';
import { TaskService } from '../services/TaskService';
import { CreateTaskRequest, UpdateTaskRequest } from '../models/Task';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createTask(req: Request, res: Response) {
    try {
      const taskData: CreateTaskRequest = req.body;
      const task = await this.taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create task' + error });
    }
  }

  async getAllTasks(req: Request, res: Response) {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  async getTasksByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const tasks = await this.taskService.getTasksByUser(userId);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user tasks' });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const taskData: UpdateTaskRequest = req.body;
      const task = await this.taskService.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update task: ' + error });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await this.taskService.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
} 