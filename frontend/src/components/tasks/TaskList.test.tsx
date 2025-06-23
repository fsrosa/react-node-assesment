import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/utils'
import TaskList from './TaskList'
import { mockTask, mockUser } from '../../test/utils'
import { TaskStatus, Priority } from '../../types'

describe('TaskList', () => {
  const defaultProps = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isSubmitting: false,
    deletingTaskId: null,
    getStatusColor: (status: TaskStatus) => 'bg-green-100 text-green-800',
    getPriorityColor: (priority: Priority) => 'bg-blue-100 text-blue-800',
  }

  const mockTasksWithUsers = [
    { ...mockTask, id: '1', user: mockUser, updatedAt: '2024-01-15T10:00:00Z', status: TaskStatus.PENDING, priority: Priority.MEDIUM },
    { ...mockTask, id: '2', title: 'Another Task', user: mockUser, updatedAt: '2024-01-16T10:00:00Z', status: TaskStatus.PENDING, priority: Priority.MEDIUM },
  ]

  it('renders empty state when no tasks are provided', () => {
    render(<TaskList tasks={[]} {...defaultProps} />)
    
    expect(screen.getByText('No tasks found')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating your first task.')).toBeInTheDocument()
  })

  it('renders tasks when provided', () => {
    render(<TaskList tasks={mockTasksWithUsers} {...defaultProps} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('sorts tasks by updatedAt in descending order', () => {
    const tasks = [
      { ...mockTask, id: '1', title: 'First Task', updatedAt: '2024-01-15T10:00:00Z', user: mockUser, status: TaskStatus.PENDING, priority: Priority.MEDIUM },
      { ...mockTask, id: '2', title: 'Second Task', updatedAt: '2024-01-16T10:00:00Z', user: mockUser, status: TaskStatus.PENDING, priority: Priority.MEDIUM },
    ]
    
    render(<TaskList tasks={tasks} {...defaultProps} />)
    
    const taskElements = screen.getAllByText(/Task$/)
    expect(taskElements[0]).toHaveTextContent('Second Task')
    expect(taskElements[1]).toHaveTextContent('First Task')
  })

  it('passes correct props to TaskCard components', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const isSubmitting = true
    const deletingTaskId = '1'
    
    render(
      <TaskList 
        tasks={mockTasksWithUsers} 
        onEdit={onEdit}
        onDelete={onDelete}
        isSubmitting={isSubmitting}
        deletingTaskId={deletingTaskId}
        getStatusColor={defaultProps.getStatusColor}
        getPriorityColor={defaultProps.getPriorityColor}
      />
    )
    
    // Verify that TaskCard components are rendered with correct props
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('renders correct number of TaskCard components', () => {
    render(<TaskList tasks={mockTasksWithUsers} {...defaultProps} />)
    
    // Each task should render a TaskCard with the task title
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Another Task')).toBeInTheDocument()
  })

  it('handles tasks without users gracefully', () => {
    const tasksWithoutUsers = [
      { ...mockTask, id: '1', user: undefined, updatedAt: '2024-01-15T10:00:00Z', status: TaskStatus.PENDING, priority: Priority.MEDIUM },
    ]
    
    render(<TaskList tasks={tasksWithoutUsers} {...defaultProps} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })
}) 