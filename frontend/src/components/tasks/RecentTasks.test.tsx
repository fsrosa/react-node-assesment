import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/utils'
import RecentTasks from './RecentTasks'
import { mockTask, mockUser } from '../../test/utils'
import { TaskStatus, Priority } from '../../types'

describe('RecentTasks', () => {
  const defaultProps = {
    getPriorityColor: (priority: Priority) => 'bg-blue-100 text-blue-800',
  }

  const mockTasksWithUsers = [
    { ...mockTask, id: '1', user: mockUser, status: TaskStatus.PENDING, priority: Priority.MEDIUM },
    { ...mockTask, id: '2', title: 'Another Task', user: mockUser, status: TaskStatus.COMPLETED, priority: Priority.HIGH },
  ]

  it('renders empty state when no tasks are provided', () => {
    render(<RecentTasks tasks={[]} {...defaultProps} />)
    
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
  })

  it('renders tasks when provided', () => {
    render(<RecentTasks tasks={mockTasksWithUsers} {...defaultProps} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('renders task details correctly', () => {
    render(<RecentTasks tasks={mockTasksWithUsers} {...defaultProps} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('John Doe • PENDING')).toBeInTheDocument()
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  it('renders unassigned when task has no user', () => {
    const tasksWithoutUser = [
      { ...mockTask, id: '1', user: undefined, status: TaskStatus.PENDING, priority: Priority.MEDIUM },
    ]
    
    render(<RecentTasks tasks={tasksWithoutUser} {...defaultProps} />)
    
    expect(screen.getByText('Unassigned • PENDING')).toBeInTheDocument()
  })

  it('applies priority color classes correctly', () => {
    const getPriorityColor = vi.fn().mockReturnValue('bg-red-100 text-red-800')
    render(<RecentTasks tasks={mockTasksWithUsers} getPriorityColor={getPriorityColor} />)
    
    expect(getPriorityColor).toHaveBeenCalledWith(Priority.MEDIUM)
    expect(getPriorityColor).toHaveBeenCalledWith(Priority.HIGH)
    
    const priorityElements = screen.getAllByText(/MEDIUM|HIGH/)
    expect(priorityElements[0]).toHaveClass('bg-red-100 text-red-800')
    expect(priorityElements[1]).toHaveClass('bg-red-100 text-red-800')
  })

  it('renders correct number of tasks', () => {
    render(<RecentTasks tasks={mockTasksWithUsers} {...defaultProps} />)
    
    const taskTitles = screen.getAllByText(/Task$/)
    expect(taskTitles).toHaveLength(2)
  })

  it('renders section title correctly', () => {
    render(<RecentTasks tasks={mockTasksWithUsers} {...defaultProps} />)
    
    expect(screen.getByText('Recent Tasks')).toBeInTheDocument()
  })

  it('handles tasks with different statuses', () => {
    const tasksWithDifferentStatuses = [
      { ...mockTask, id: '1', user: mockUser, status: TaskStatus.IN_PROGRESS, priority: Priority.MEDIUM },
      { ...mockTask, id: '2', title: 'Another Task', user: mockUser, status: TaskStatus.CANCELLED, priority: Priority.HIGH },
    ]
    
    render(<RecentTasks tasks={tasksWithDifferentStatuses} {...defaultProps} />)
    
    expect(screen.getByText('John Doe • IN_PROGRESS')).toBeInTheDocument()
    expect(screen.getByText('John Doe • CANCELLED')).toBeInTheDocument()
  })

  it('handles tasks with different priorities', () => {
    const tasksWithDifferentPriorities = [
      { ...mockTask, id: '1', user: mockUser, status: TaskStatus.PENDING, priority: Priority.LOW },
      { ...mockTask, id: '2', title: 'Another Task', user: mockUser, status: TaskStatus.PENDING, priority: Priority.URGENT },
    ]
    
    render(<RecentTasks tasks={tasksWithDifferentPriorities} {...defaultProps} />)
    
    expect(screen.getByText('LOW')).toBeInTheDocument()
    expect(screen.getByText('URGENT')).toBeInTheDocument()
  })
}) 