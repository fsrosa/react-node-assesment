import { describe, it, expect, vi, beforeEach } from 'vitest'
import api, { userApi, taskApi } from './api'
import { TaskStatus, Priority } from '../types'

describe('API Service', () => {
  beforeEach(() => {
    // Patch api methods for each test
    api.get = vi.fn()
    api.post = vi.fn()
    api.put = vi.fn()
    api.delete = vi.fn()
  })

  describe('userApi', () => {
    it('gets all users successfully', async () => {
      const mockUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ]
      ;(api.get as any).mockResolvedValue({ data: mockUsers })
      const result = await userApi.getAll()
      expect(result).toEqual(mockUsers)
      expect(api.get).toHaveBeenCalledWith('/users')
    })

    it('gets user by id successfully', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
      ;(api.get as any).mockResolvedValue({ data: mockUser })
      const result = await userApi.getById('1')
      expect(result).toEqual(mockUser)
      expect(api.get).toHaveBeenCalledWith('/users/1')
    })

    it('creates user successfully', async () => {
      const userData = { name: 'John Doe', email: 'john@example.com' }
      const createdUser = { id: '1', ...userData, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
      ;(api.post as any).mockResolvedValue({ data: createdUser })
      const result = await userApi.create(userData)
      expect(result).toEqual(createdUser)
      expect(api.post).toHaveBeenCalledWith('/users', userData)
    })

    it('updates user successfully', async () => {
      const updateData = { name: 'John Updated' }
      const updatedUser = { id: '1', name: 'John Updated', email: 'john@example.com', createdAt: '2024-01-01', updatedAt: '2024-01-01' }
      ;(api.put as any).mockResolvedValue({ data: updatedUser })
      const result = await userApi.update('1', updateData)
      expect(result).toEqual(updatedUser)
      expect(api.put).toHaveBeenCalledWith('/users/1', updateData)
    })

    it('deletes user successfully', async () => {
      ;(api.delete as any).mockResolvedValue({})
      const result = await userApi.delete('1')
      expect(result).toBe(true)
      expect(api.delete).toHaveBeenCalledWith('/users/1')
    })

    it('handles API errors', async () => {
      ;(api.get as any).mockRejectedValue(new Error('API Error'))
      await expect(userApi.getAll()).rejects.toThrow('API Error')
    })
  })

  describe('taskApi', () => {
    it('gets all tasks successfully', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          status: TaskStatus.COMPLETED,
          priority: Priority.HIGH,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      ;(api.get as any).mockResolvedValue({ data: mockTasks })
      const result = await taskApi.getAll()
      expect(result).toEqual(mockTasks)
      expect(api.get).toHaveBeenCalledWith('/tasks')
    })

    it('gets task by id successfully', async () => {
      const mockTask = {
        id: '1',
        title: 'Task 1',
        description: 'Description 1',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      ;(api.get as any).mockResolvedValue({ data: mockTask })
      const result = await taskApi.getById('1')
      expect(result).toEqual(mockTask)
      expect(api.get).toHaveBeenCalledWith('/tasks/1')
    })

    it('gets tasks by user successfully', async () => {
      const mockTasks = [
        {
          id: '1',
          title: 'User Task 1',
          description: 'Description 1',
          status: TaskStatus.PENDING,
          priority: Priority.MEDIUM,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ]
      ;(api.get as any).mockResolvedValue({ data: mockTasks })
      const result = await taskApi.getByUser('1')
      expect(result).toEqual(mockTasks)
      expect(api.get).toHaveBeenCalledWith('/tasks/user/1')
    })

    it('creates task successfully', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
      }
      const createdTask = {
        id: '1',
        ...taskData,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      ;(api.post as any).mockResolvedValue({ data: createdTask })
      const result = await taskApi.create(taskData)
      expect(result).toEqual(createdTask)
      expect(api.post).toHaveBeenCalledWith('/tasks', taskData)
    })

    it('updates task successfully', async () => {
      const updateData = { title: 'Updated Task' }
      const updatedTask = {
        id: '1',
        title: 'Updated Task',
        description: 'Description 1',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      ;(api.put as any).mockResolvedValue({ data: updatedTask })
      const result = await taskApi.update('1', updateData)
      expect(result).toEqual(updatedTask)
      expect(api.put).toHaveBeenCalledWith('/tasks/1', updateData)
    })

    it('deletes task successfully', async () => {
      ;(api.delete as any).mockResolvedValue({})
      const result = await taskApi.delete('1')
      expect(result).toBe(true)
      expect(api.delete).toHaveBeenCalledWith('/tasks/1')
    })

    it('handles API errors for tasks', async () => {
      ;(api.get as any).mockRejectedValue(new Error('Task API Error'))
      await expect(taskApi.getAll()).rejects.toThrow('Task API Error')
    })
  })
}) 