import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUsers } from './useUsers'
import type { User } from '../types'

// Mock the API
vi.mock('../services/api', () => ({
  userApi: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

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

describe('useUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useUsers())

    expect(result.current.submitting).toBe(false)
    expect(result.current.deletingUserId).toBe(null)
    expect(result.current.showModal).toBe(false)
    expect(result.current.editingUser).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      name: '',
      email: '',
    })
  })

  it('opens create modal correctly', () => {
    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.openCreateModal()
    })

    expect(result.current.showModal).toBe(true)
    expect(result.current.editingUser).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      name: '',
      email: '',
    })
  })

  it('closes modal correctly', () => {
    const { result } = renderHook(() => useUsers())

    // First open the modal
    act(() => {
      result.current.openCreateModal()
    })

    // Then close it
    act(() => {
      result.current.closeModal()
    })

    expect(result.current.showModal).toBe(false)
    expect(result.current.editingUser).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      name: '',
      email: '',
    })
  })

  it('updates form data correctly', () => {
    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.updateFormData('name', 'John Doe')
    })

    expect(result.current.formData.name).toBe('John Doe')
  })

  it('updates email form data correctly', () => {
    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.updateFormData('email', 'john@example.com')
    })

    expect(result.current.formData.email).toBe('john@example.com')
  })

  it('handles edit user correctly', () => {
    const { result } = renderHook(() => useUsers())
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    act(() => {
      result.current.handleEdit(mockUser)
    })

    expect(result.current.showModal).toBe(true)
    expect(result.current.editingUser).toEqual(mockUser)
    expect(result.current.error).toBe(null)
    expect(result.current.formData).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
    })
  })

  it('returns correct state properties', () => {
    const { result } = renderHook(() => useUsers())

    expect(result.current.users).toBeDefined()
    expect(result.current.loading).toBeDefined()
    expect(result.current.submitting).toBeDefined()
    expect(result.current.deletingUserId).toBeDefined()
    expect(result.current.showModal).toBeDefined()
    expect(result.current.editingUser).toBeDefined()
    expect(result.current.error).toBeDefined()
    expect(result.current.formData).toBeDefined()
  })

  it('returns correct action functions', () => {
    const { result } = renderHook(() => useUsers())

    expect(typeof result.current.handleSubmit).toBe('function')
    expect(typeof result.current.handleEdit).toBe('function')
    expect(typeof result.current.handleDelete).toBe('function')
    expect(typeof result.current.openCreateModal).toBe('function')
    expect(typeof result.current.closeModal).toBe('function')
    expect(typeof result.current.updateFormData).toBe('function')
  })
}) 