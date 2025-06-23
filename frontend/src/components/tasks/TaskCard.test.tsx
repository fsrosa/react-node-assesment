import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils'
import TaskCard from './TaskCard'
import { mockTask, mockUser } from '../../test/utils'

describe('TaskCard', () => {
  const defaultProps = {
    task: { ...mockTask, user: mockUser },
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isSubmitting: false,
    isDeleting: false,
    getStatusColor: (status: string) => 'bg-green-100 text-green-800',
    getPriorityColor: (priority: string) => 'bg-blue-100 text-blue-800',
  }

  it('renders task information correctly', () => {
    render(<TaskCard {...defaultProps} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('This is a test task')).toBeInTheDocument()
    expect(screen.getByText('Assigned to: John Doe')).toBeInTheDocument()
    expect(screen.getByText('Status: pending')).toBeInTheDocument()
    expect(screen.getByText('Priority: medium')).toBeInTheDocument()
  })

  it('renders without description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined, user: mockUser }
    render(<TaskCard {...defaultProps} task={taskWithoutDescription} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.queryByText('This is a test task')).not.toBeInTheDocument()
  })

  it('renders unassigned when no user is provided', () => {
    const taskWithoutUser = { ...mockTask, user: undefined }
    render(<TaskCard {...defaultProps} task={taskWithoutUser} />)
    
    expect(screen.getByText('Assigned to: Unassigned')).toBeInTheDocument()
  })

  it('renders due date when provided', () => {
    const taskWithDueDate = { 
      ...mockTask, 
      dueDate: '2024-01-15T10:00:00Z',
      user: mockUser 
    }
    render(<TaskCard {...defaultProps} task={taskWithDueDate} />)
    
    expect(screen.getByText('Due: 2024-01-15')).toBeInTheDocument()
  })

  it('does not render due date when not provided', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: undefined, user: mockUser }
    render(<TaskCard {...defaultProps} task={taskWithoutDueDate} />)
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<TaskCard {...defaultProps} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultProps.task)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<TaskCard {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.task.id)
  })

  it('disables buttons when isSubmitting is true', () => {
    render(<TaskCard {...defaultProps} isSubmitting={true} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    expect(editButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('disables buttons when isDeleting is true', () => {
    render(<TaskCard {...defaultProps} isDeleting={true} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    expect(editButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('shows loading state on delete button when isDeleting is true', () => {
    render(<TaskCard {...defaultProps} isDeleting={true} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toBeDisabled()
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
  })

  it('applies status color classes correctly', () => {
    const getStatusColor = vi.fn().mockReturnValue('bg-red-100 text-red-800')
    render(<TaskCard {...defaultProps} getStatusColor={getStatusColor} />)
    
    expect(getStatusColor).toHaveBeenCalledWith('pending')
    expect(screen.getByText('Status: pending')).toHaveClass('bg-red-100 text-red-800')
  })

  it('applies priority color classes correctly', () => {
    const getPriorityColor = vi.fn().mockReturnValue('bg-yellow-100 text-yellow-800')
    render(<TaskCard {...defaultProps} getPriorityColor={getPriorityColor} />)
    
    expect(getPriorityColor).toHaveBeenCalledWith('medium')
    expect(screen.getByText('Priority: medium')).toHaveClass('bg-yellow-100 text-yellow-800')
  })

  it('has correct accessibility attributes', () => {
    render(<TaskCard {...defaultProps} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    expect(editButton).toBeInTheDocument()
    expect(deleteButton).toBeInTheDocument()
  })
}) 