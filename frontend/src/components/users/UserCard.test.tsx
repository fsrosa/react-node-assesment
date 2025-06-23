import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils'
import UserCard from './UserCard'
import { mockUser } from '../../test/utils'

describe('UserCard', () => {
  const defaultProps = {
    user: mockUser,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isSubmitting: false,
    isDeleting: false,
  }

  it('renders user information correctly', () => {
    render(<UserCard {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('renders creation date correctly', () => {
    render(<UserCard {...defaultProps} />)
    
    const creationDate = new Date(mockUser.createdAt).toLocaleDateString()
    expect(screen.getByText(`Created: ${creationDate}`)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', () => {
    render(<UserCard {...defaultProps} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith(defaultProps.user)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(<UserCard {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    expect(defaultProps.onDelete).toHaveBeenCalledWith(defaultProps.user.id)
  })

  it('disables buttons when isSubmitting is true', () => {
    render(<UserCard {...defaultProps} isSubmitting={true} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    expect(editButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('disables buttons when isDeleting is true', () => {
    render(<UserCard {...defaultProps} isDeleting={true} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    expect(editButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('shows loading state on delete button when isDeleting is true', () => {
    render(<UserCard {...defaultProps} isDeleting={true} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toBeDisabled()
  })

  it('renders user icon correctly', () => {
    render(<UserCard {...defaultProps} />)
    
    // Check that the user icon container exists
    const iconContainer = screen.getByText('John Doe').closest('.flex')?.querySelector('.p-2')
    expect(iconContainer).toHaveClass('p-2', 'bg-blue-100', 'rounded-full')
  })

  it('has correct card styling', () => {
    render(<UserCard {...defaultProps} />)
    
    const card = screen.getByText('John Doe').closest('.bg-white')
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6')
  })

  it('has correct layout structure', () => {
    render(<UserCard {...defaultProps} />)
    
    // Check that the main flex container exists
    const flexContainer = screen.getByText('John Doe').closest('.flex')
    expect(flexContainer).toHaveClass('flex', 'items-center')
  })

  it('renders user details with correct styling', () => {
    render(<UserCard {...defaultProps} />)
    
    const name = screen.getByText('John Doe')
    expect(name).toHaveClass('text-lg', 'font-medium', 'text-gray-900')
    
    const email = screen.getByText('john@example.com')
    expect(email).toHaveClass('text-sm', 'text-gray-500')
  })

  it('renders buttons with correct styling', () => {
    render(<UserCard {...defaultProps} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    expect(editButton).toHaveClass('p-2')
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    expect(deleteButton).toHaveClass('p-2')
  })

  it('renders creation date with correct styling', () => {
    render(<UserCard {...defaultProps} />)
    
    const creationDate = screen.getByText(/Created:/)
    expect(creationDate).toHaveClass('text-xs', 'text-gray-400')
  })

  it('handles different user data', () => {
    const differentUser = {
      ...mockUser,
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: '2024-01-01T00:00:00Z',
    }
    
    render(<UserCard {...defaultProps} user={differentUser} />)
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<UserCard {...defaultProps} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    expect(editButton).toBeInTheDocument()
    expect(deleteButton).toBeInTheDocument()
  })

  it('renders buttons in correct order', () => {
    render(<UserCard {...defaultProps} />)
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    
    expect(editButton).toHaveAttribute('aria-label', 'Edit user')
    expect(deleteButton).toHaveAttribute('aria-label', 'Delete user')
    
    // Check that edit button comes before delete button in the DOM
    const buttonContainer = editButton.parentElement
    const buttons = buttonContainer?.querySelectorAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons?.[0]).toBe(editButton)
    expect(buttons?.[1]).toBe(deleteButton)
  })

  it('handles long user names gracefully', () => {
    const userWithLongName = {
      ...mockUser,
      name: 'This is a very long user name that might wrap to multiple lines',
    }
    
    render(<UserCard {...defaultProps} user={userWithLongName} />)
    
    expect(screen.getByText(userWithLongName.name)).toBeInTheDocument()
  })

  it('handles long email addresses gracefully', () => {
    const userWithLongEmail = {
      ...mockUser,
      email: 'this.is.a.very.long.email.address@example.com',
    }
    
    render(<UserCard {...defaultProps} user={userWithLongEmail} />)
    
    expect(screen.getByText(userWithLongEmail.email)).toBeInTheDocument()
  })
}) 