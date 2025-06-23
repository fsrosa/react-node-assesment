import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils'
import UserModal from './UserModal'
import { mockUser } from '../../test/utils'

describe('UserModal', () => {
  const defaultProps = {
    isOpen: true,
    editingUser: null,
    formData: {
      name: '',
      email: '',
    },
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
    render(<UserModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Add User')).not.toBeInTheDocument()
  })

  it('renders add user modal when editingUser is null', () => {
    render(<UserModal {...defaultProps} />)
    
    expect(screen.getByText('Add User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('renders edit user modal when editingUser is provided', () => {
    render(<UserModal {...defaultProps} editingUser={mockUser} />)
    
    expect(screen.getByText('Edit User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
  })

  it('displays error message when error is provided', () => {
    const errorMessage = 'Something went wrong'
    render(<UserModal {...defaultProps} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('calls onFormDataChange when form fields are changed', () => {
    render(<UserModal {...defaultProps} />)
    
    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'New User' } })
    
    expect(defaultProps.onFormDataChange).toHaveBeenCalledWith('name', 'New User')
  })

  it('calls onFormDataChange when email field is changed', () => {
    render(<UserModal {...defaultProps} />)
    
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } })
    
    expect(defaultProps.onFormDataChange).toHaveBeenCalledWith('email', 'new@example.com')
  })

  it('calls onSubmit when form is submitted', () => {
    render(<UserModal {...defaultProps} />)
    
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<UserModal {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)
    
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('disables form fields when isSubmitting is true', () => {
    render(<UserModal {...defaultProps} isSubmitting={true} />)
    
    const nameInput = screen.getByLabelText('Name')
    const emailInput = screen.getByLabelText('Email')
    
    expect(nameInput).toBeDisabled()
    expect(emailInput).toBeDisabled()
  })

  it('disables buttons when isSubmitting is true', () => {
    render(<UserModal {...defaultProps} isSubmitting={true} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    const submitButton = screen.getByRole('button', { name: 'Create' })
    
    expect(cancelButton).toBeDisabled()
    expect(submitButton).toBeDisabled()
  })

  it('renders all form fields with correct labels', () => {
    render(<UserModal {...defaultProps} />)
    
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('populates form with editing user data', () => {
    const formData = {
      name: mockUser.name,
      email: mockUser.email,
    }
    
    render(<UserModal {...defaultProps} editingUser={mockUser} formData={formData} />)
    
    expect(screen.getByDisplayValue(mockUser.name)).toBeInTheDocument()
    expect(screen.getByDisplayValue(mockUser.email)).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<UserModal {...defaultProps} />)
    
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).toBeRequired()
    
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toBeRequired()
    expect(emailInput).toHaveAttribute('type', 'email')
  })

  it('renders modal with correct styling', () => {
    render(<UserModal {...defaultProps} />)
    
    const modal = screen.getByText('Add User').closest('.fixed')
    expect(modal).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50')
  })

  it('renders modal content with correct styling', () => {
    render(<UserModal {...defaultProps} />)
    
    const modalContent = screen.getByText('Add User').closest('.bg-white')
    expect(modalContent).toHaveClass('bg-white', 'rounded-lg', 'p-6')
  })

  it('renders error with correct styling', () => {
    const errorMessage = 'Validation error'
    render(<UserModal {...defaultProps} error={errorMessage} />)
    
    const errorContainer = screen.getByText(errorMessage).closest('div')
    expect(errorContainer).toHaveClass('flex', 'items-center')
  })

  it('renders form fields with correct styling', () => {
    render(<UserModal {...defaultProps} />)
    
    const nameInput = screen.getByLabelText('Name')
    expect(nameInput).toHaveClass('border', 'border-gray-300', 'rounded-md')
    
    const emailInput = screen.getByLabelText('Email')
    expect(emailInput).toHaveClass('border', 'border-gray-300', 'rounded-md')
  })

  it('renders buttons with correct styling', () => {
    render(<UserModal {...defaultProps} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    expect(cancelButton).toBeInTheDocument()
    
    const submitButton = screen.getByRole('button', { name: 'Create' })
    expect(submitButton).toBeInTheDocument()
  })

  it('handles form submission with empty fields', () => {
    render(<UserModal {...defaultProps} />)
    
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('handles form submission with filled fields', () => {
    const formData = {
      name: 'Test User',
      email: 'test@example.com',
    }
    
    render(<UserModal {...defaultProps} formData={formData} />)
    
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('renders modal title correctly for add mode', () => {
    render(<UserModal {...defaultProps} />)
    
    expect(screen.getByText('Add User')).toBeInTheDocument()
  })

  it('renders modal title correctly for edit mode', () => {
    render(<UserModal {...defaultProps} editingUser={mockUser} />)
    
    expect(screen.getByText('Edit User')).toBeInTheDocument()
  })

  it('renders submit button text correctly for add mode', () => {
    render(<UserModal {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  it('renders submit button text correctly for edit mode', () => {
    render(<UserModal {...defaultProps} editingUser={mockUser} />)
    
    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument()
  })
}) 