import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDashboard } from './useDashboard'
import { Priority, TaskStatus } from '../types'

// Mock the context with a simple implementation
vi.mock('../context', () => ({
  useData: vi.fn(() => ({
    users: [],
    tasks: [],
    loading: false,
    error: null,
    refreshUsers: vi.fn(),
    refreshTasks: vi.fn(),
    refreshAll: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  })),
}))

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useDashboard())

    expect(result.current.users).toEqual([])
    expect(result.current.tasks).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.stats).toBeDefined()
    expect(result.current.recentTasks).toBeDefined()
  })

  it('returns correct priority colors', () => {
    const { result } = renderHook(() => useDashboard())

    expect(result.current.getPriorityColor(Priority.URGENT)).toBe('bg-red-100 text-red-800')
    expect(result.current.getPriorityColor(Priority.HIGH)).toBe('bg-orange-100 text-orange-800')
    expect(result.current.getPriorityColor(Priority.MEDIUM)).toBe('bg-yellow-100 text-yellow-800')
    expect(result.current.getPriorityColor(Priority.LOW)).toBe('bg-green-100 text-green-800')
  })

  it('calculates stats correctly with empty data', () => {
    const { result } = renderHook(() => useDashboard())

    const stats = result.current.stats
    expect(stats).toHaveLength(4)
    
    expect(stats[0]).toEqual({
      title: 'Total Users',
      value: 0,
      icon: 'Users',
      color: 'bg-blue-500',
    })
    
    expect(stats[1]).toEqual({
      title: 'Total Tasks',
      value: 0,
      icon: 'CheckSquare',
      color: 'bg-green-500',
    })
    
    expect(stats[2]).toEqual({
      title: 'Pending Tasks',
      value: 0,
      icon: 'Clock',
      color: 'bg-yellow-500',
    })
    
    expect(stats[3]).toEqual({
      title: 'High/Urgent Priority',
      value: 0,
      icon: 'AlertTriangle',
      color: 'bg-red-500',
    })
  })

  it('calculates stats correctly with sample data', async () => {
    // Mock the context with sample data
    const { useData } = await import('../context')
    vi.mocked(useData).mockReturnValue({
      users: [
        { id: '1', name: 'User 1', email: 'user1@example.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        { id: '2', name: 'User 2', email: 'user2@example.com', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
      ] as any,
      tasks: [
        { id: '1', title: 'Task 1', description: 'Description 1', status: TaskStatus.PENDING, priority: Priority.HIGH, dueDate: '2024-01-15T10:00:00Z', userId: '1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        { id: '2', title: 'Task 2', description: 'Description 2', status: TaskStatus.COMPLETED, priority: Priority.MEDIUM, dueDate: '2024-01-15T10:00:00Z', userId: '1', createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
        { id: '3', title: 'Task 3', description: 'Description 3', status: TaskStatus.PENDING, priority: Priority.URGENT, dueDate: '2024-01-15T10:00:00Z', userId: '2', createdAt: '2024-01-03T00:00:00Z', updatedAt: '2024-01-03T00:00:00Z' },
      ] as any,
      loading: false,
      error: null,
      refreshUsers: vi.fn(),
      refreshTasks: vi.fn(),
      refreshAll: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    })

    const { result } = renderHook(() => useDashboard())

    const stats = result.current.stats
    
    expect(stats[0].value).toBe(2) // Total Users
    expect(stats[1].value).toBe(3) // Total Tasks
    expect(stats[2].value).toBe(2) // Pending Tasks
    expect(stats[3].value).toBe(2) // High/Urgent Priority (HIGH + URGENT)
  })

  it('returns recent tasks sorted by creation date', async () => {
    // Mock the context with sample data
    const { useData } = await import('../context')
    vi.mocked(useData).mockReturnValue({
      users: [],
      tasks: [
        { id: '1', title: 'Task 1', description: 'Description 1', status: TaskStatus.PENDING, priority: Priority.HIGH, dueDate: '2024-01-15T10:00:00Z', userId: '1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        { id: '2', title: 'Task 2', description: 'Description 2', status: TaskStatus.COMPLETED, priority: Priority.MEDIUM, dueDate: '2024-01-15T10:00:00Z', userId: '1', createdAt: '2024-01-03T00:00:00Z', updatedAt: '2024-01-02T00:00:00Z' },
        { id: '3', title: 'Task 3', description: 'Description 3', status: TaskStatus.PENDING, priority: Priority.URGENT, dueDate: '2024-01-15T10:00:00Z', userId: '2', createdAt: '2024-01-02T00:00:00Z', updatedAt: '2024-01-03T00:00:00Z' },
      ] as any,
      loading: false,
      error: null,
      refreshUsers: vi.fn(),
      refreshTasks: vi.fn(),
      refreshAll: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    })

    const { result } = renderHook(() => useDashboard())

    const recentTasks = result.current.recentTasks
    
    expect(recentTasks).toHaveLength(3)
    expect(recentTasks[0].id).toBe('2') // Most recent (2024-01-03)
    expect(recentTasks[1].id).toBe('3') // Second most recent (2024-01-02)
    expect(recentTasks[2].id).toBe('1') // Oldest (2024-01-01)
  })

  it('limits recent tasks to 5 items', async () => {
    // Mock the context with more than 5 tasks
    const manyTasks = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      title: `Task ${i + 1}`,
      description: `Description ${i + 1}`,
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      dueDate: '2024-01-15T10:00:00Z',
      userId: '1',
      createdAt: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
      updatedAt: `2024-01-${String(i + 1).padStart(2, '0')}T00:00:00Z`,
    }))

    const { useData } = await import('../context')
    vi.mocked(useData).mockReturnValue({
      users: [],
      tasks: manyTasks as any,
      loading: false,
      error: null,
      refreshUsers: vi.fn(),
      refreshTasks: vi.fn(),
      refreshAll: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
    })

    const { result } = renderHook(() => useDashboard())

    const recentTasks = result.current.recentTasks
    
    expect(recentTasks).toHaveLength(5)
    expect(recentTasks[0].id).toBe('10') // Most recent
    expect(recentTasks[4].id).toBe('6')  // 5th most recent
  })

  it('returns correct state properties', () => {
    const { result } = renderHook(() => useDashboard())

    expect(result.current.users).toBeDefined()
    expect(result.current.tasks).toBeDefined()
    expect(result.current.loading).toBeDefined()
    expect(result.current.stats).toBeDefined()
    expect(result.current.recentTasks).toBeDefined()
  })

  it('returns correct utility functions', () => {
    const { result } = renderHook(() => useDashboard())

    expect(typeof result.current.getPriorityColor).toBe('function')
  })
}) 