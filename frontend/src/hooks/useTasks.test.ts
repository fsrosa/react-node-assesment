import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTasks } from './useTasks'
import { TaskStatus, Priority } from '../types'

// Mock the API
vi.mock('../services/api', () => ({
  taskApi: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

// Mock the context with a simple implementation
vi.mock('../context', () => ({
  useData: vi.fn(() => ({
    tasks: [],
    users: [],
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

describe('useTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useTasks())

    expect(result.current.submitting).toBe(false)
    expect(result.current.deletingTaskId).toBe(null)
    expect(result.current.showModal).toBe(false)
    expect(result.current.editingTask).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      dueDate: '',
      userId: '',
    })
  })

  it('opens create modal correctly', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.openCreateModal()
    })

    expect(result.current.showModal).toBe(true)
    expect(result.current.editingTask).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      dueDate: '',
      userId: '',
    })
  })

  it('closes modal correctly', () => {
    const { result } = renderHook(() => useTasks())

    // First open the modal
    act(() => {
      result.current.openCreateModal()
    })

    // Then close it
    act(() => {
      result.current.closeModal()
    })

    expect(result.current.showModal).toBe(false)
    expect(result.current.editingTask).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      dueDate: '',
      userId: '',
    })
  })

  it('updates form data correctly', () => {
    const { result } = renderHook(() => useTasks())

    act(() => {
      result.current.updateFormData('title', 'New Task')
    })

    expect(result.current.formData.title).toBe('New Task')
  })

  it('handles edit task correctly', () => {
    const { result } = renderHook(() => useTasks())
    const mockTask = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: '2024-01-15T10:00:00Z',
      userId: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    act(() => {
      result.current.handleEdit(mockTask)
    })

    expect(result.current.showModal).toBe(true)
    expect(result.current.editingTask).toEqual(mockTask)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      dueDate: '2024-01-15',
      userId: '1',
    })
  })

  it('returns correct status colors', () => {
    const { result } = renderHook(() => useTasks())

    expect(result.current.getStatusColor(TaskStatus.COMPLETED)).toBe('bg-green-100 text-green-800')
    expect(result.current.getStatusColor(TaskStatus.IN_PROGRESS)).toBe('bg-blue-100 text-blue-800')
    expect(result.current.getStatusColor(TaskStatus.CANCELLED)).toBe('bg-red-100 text-red-800')
    expect(result.current.getStatusColor(TaskStatus.PENDING)).toBe('bg-yellow-100 text-yellow-800')
  })

  it('returns correct priority colors', () => {
    const { result } = renderHook(() => useTasks())

    expect(result.current.getPriorityColor(Priority.URGENT)).toBe('bg-red-100 text-red-800')
    expect(result.current.getPriorityColor(Priority.HIGH)).toBe('bg-orange-100 text-orange-800')
    expect(result.current.getPriorityColor(Priority.MEDIUM)).toBe('bg-yellow-100 text-yellow-800')
    expect(result.current.getPriorityColor(Priority.LOW)).toBe('bg-green-100 text-green-800')
  })
}) 