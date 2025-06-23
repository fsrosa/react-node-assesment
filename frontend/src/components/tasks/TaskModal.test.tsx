import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/utils'
import TaskModal from './TaskModal'
import { mockTask, mockUser } from '../../test/utils'
import { TaskStatus, Priority } from '../../types'

describe('TaskModal', () => {
  const defaultProps = {
    isOpen: true,
    editingTask: null,
    formData: {
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      dueDate: '',
      userId: '',
    },
    users: [mockUser],
    error: null,
    isSubmitting: false,
    onSubmit: vi.fn(),
    onClose: vi.fn(),
    onFormDataChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    render(<TaskModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Add Task')).not.toBeInTheDocument()
  })

  it('renders add task modal when editingTask is null', () => {
    render(<TaskModal {...defaultProps} />)
    
    expect(screen.getByText('Add Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('renders edit task modal when editingTask is provided', () => {
    const editingTask = { ...mockTask, status: TaskStatus.PENDING, priority: Priority.MEDIUM }
    render(<TaskModal {...defaultProps} editingTask={editingTask} />)
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'Something went wrong'
    render(<TaskModal {...defaultProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('calls onFormDataChange when form fields are changed', () => {
    render(<TaskModal {...defaultProps} />)
    
    const titleInput = screen.getByLabelText('Title')
    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    
    expect(defaultProps.onFormDataChange).toHaveBeenCalledWith('title', 'New Task')
  })

  it('calls onSubmit when form is submitted', () => {
    render(<TaskModal {...defaultProps} />)
    
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<TaskModal {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('disables form fields when isSubmitting is true', () => {
    render(<TaskModal {...defaultProps} isSubmitting={true} />)
    
    const titleInput = screen.getByLabelText('Title')
    const descriptionTextarea = screen.getByLabelText('Description')
    const statusSelect = screen.getByLabelText('Status')
    const prioritySelect = screen.getByLabelText('Priority')
    const dueDateInput = screen.getByLabelText('Due Date')
    const userSelect = screen.getByLabelText('Assign to User')
    
    expect(titleInput).toBeDisabled()
    expect(descriptionTextarea).toBeDisabled()
    expect(statusSelect).toBeDisabled()
    expect(prioritySelect).toBeDisabled()
    expect(dueDateInput).toBeDisabled()
    expect(userSelect).toBeDisabled()
  })

  it('disables buttons when isSubmitting is true', () => {
    render(<TaskModal {...defaultProps} isSubmitting={true} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const submitButton = screen.getByRole('button', { name: 'Create' })
    
    expect(cancelButton).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('renders all form fields with correct labels', () => {
    render(<TaskModal {...defaultProps} />)
    
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Priority')).toBeInTheDocument()
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Assign to User')).toBeInTheDocument()
  })

  it('renders status options correctly', () => {
    render(<TaskModal {...defaultProps} />)
    
    const statusSelect = screen.getByLabelText('Status')
    expect(statusSelect).toHaveValue(TaskStatus.PENDING)
    
    const options = Array.from(statusSelect.querySelectorAll('option'))
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveValue(TaskStatus.PENDING)
    expect(options[1]).toHaveValue(TaskStatus.IN_PROGRESS)
    expect(options[2]).toHaveValue(TaskStatus.COMPLETED)
    expect(options[3]).toHaveValue(TaskStatus.CANCELLED)
  })

  it('renders priority options correctly', () => {
    render(<TaskModal {...defaultProps} />)
    
    const prioritySelect = screen.getByLabelText('Priority')
    expect(prioritySelect).toHaveValue(Priority.MEDIUM)
    
    const options = Array.from(prioritySelect.querySelectorAll('option'))
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveValue(Priority.LOW)
    expect(options[1]).toHaveValue(Priority.MEDIUM)
    expect(options[2]).toHaveValue(Priority.HIGH)
    expect(options[3]).toHaveValue(Priority.URGENT)
  })

  it('renders user options correctly', () => {
    render(<TaskModal {...defaultProps} />)
    
    const userSelect = screen.getByLabelText('Assign to User')
    const options = Array.from(userSelect.querySelectorAll('option'))
    
    expect(options).toHaveLength(2) // Unassigned + 1 user
    expect(options[0]).toHaveValue('')
    expect(options[0]).toHaveTextContent('Unassigned')
    expect(options[1]).toHaveValue(mockUser.id)
    expect(options[1]).toHaveTextContent(mockUser.name)
  })

  it('populates form with editing task data', () => {
    const editingTask = { ...mockTask, status: TaskStatus.COMPLETED, priority: Priority.HIGH }
    const formData = {
      title: editingTask.title,
      description: editingTask.description || '',
      status: editingTask.status,
      priority: editingTask.priority,
      dueDate: '',
      userId: '',
    }
    
    render(<TaskModal {...defaultProps} editingTask={editingTask} formData={formData} />)
    
    expect(screen.getByDisplayValue(editingTask.title)).toBeInTheDocument()
    expect(screen.getByDisplayValue(editingTask.description || '')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<TaskModal {...defaultProps} />)
    
    const titleInput = screen.getByLabelText('Title')
    expect(titleInput).toBeRequired()
    
    const userSelect = screen.getByLabelText('Assign to User')
    expect(userSelect).toBeRequired()
  })
}) 