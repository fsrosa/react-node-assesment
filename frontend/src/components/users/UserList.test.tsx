import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/utils'
import UserList from './UserList'
import { mockUser } from '../../test/utils'

describe('UserList', () => {
  const defaultProps = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    isSubmitting: false,
    deletingUserId: null,
  }

  const mockUsers = [
    mockUser,
    {
      ...mockUser,
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
  ]

  it('renders empty state when no users are provided', () => {
    render(<UserList users={[]} {...defaultProps} />)
    
    expect(screen.getByText('No users found')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating your first user.')).toBeInTheDocument()
  })

  it('renders users when provided', () => {
    render(<UserList users={mockUsers} {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders user details correctly', () => {
    render(<UserList users={mockUsers} {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
  })

  it('passes correct props to UserCard components', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const isSubmitting = true
    const deletingUserId = '1'
    
    render(
      <UserList 
        users={mockUsers} 
        onEdit={onEdit}
        onDelete={onDelete}
        isSubmitting={isSubmitting}
        deletingUserId={deletingUserId}
      />
    )
    
    // Verify that UserCard components are rendered with correct props
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders correct number of UserCard components', () => {
    render(<UserList users={mockUsers} {...defaultProps} />)
    
    // Each user should render a UserCard with the user name
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('handles single user correctly', () => {
    const singleUser = [mockUser]
    render(<UserList users={singleUser} {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument()
  })

  it('handles multiple users correctly', () => {
    const multipleUsers = [
      mockUser,
      { ...mockUser, id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { ...mockUser, id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
    ]
    
    render(<UserList users={multipleUsers} {...defaultProps} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
  })

  it('renders empty state with correct styling', () => {
    render(<UserList users={[]} {...defaultProps} />)
    
    const emptyState = screen.getByText('No users found').closest('div')
    expect(emptyState).toHaveClass('text-center', 'py-12')
  })

  it('renders user list with correct styling', () => {
    render(<UserList users={mockUsers} {...defaultProps} />)
    
    const userList = screen.getByText('John Doe').closest('.space-y-4')
    expect(userList).toBeInTheDocument()
  })

  it('handles users with different data', () => {
    const variedUsers = [
      { ...mockUser, id: '1', name: 'Alice Cooper', email: 'alice@example.com' },
      { ...mockUser, id: '2', name: 'Bob Dylan', email: 'bob@example.com' },
      { ...mockUser, id: '3', name: 'Charlie Brown', email: 'charlie@example.com' },
    ]
    
    render(<UserList users={variedUsers} {...defaultProps} />)
    
    expect(screen.getByText('Alice Cooper')).toBeInTheDocument()
    expect(screen.getByText('Bob Dylan')).toBeInTheDocument()
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument()
  })

  it('renders empty state icon correctly', () => {
    render(<UserList users={[]} {...defaultProps} />)
    
    // Check that the user icon is present in the empty state
    const emptyState = screen.getByText('No users found').closest('div')
    expect(emptyState).toBeInTheDocument()
  })

  it('maintains list structure with different user counts', () => {
    const testCases = [
      { users: [mockUser], expectedCount: 1 },
      { users: mockUsers, expectedCount: 2 },
      { users: [...mockUsers, { ...mockUser, id: '3', name: 'Bob', email: 'bob@example.com' }], expectedCount: 3 },
    ]
    
    testCases.forEach(({ users, expectedCount }) => {
      const { unmount } = render(<UserList users={users} {...defaultProps} />)
      
      const userNames = users.map(user => user.name)
      userNames.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument()
      })
      
      unmount()
    })
  })

  it('handles users with long names gracefully', () => {
    const usersWithLongNames = [
      { ...mockUser, name: 'This is a very long user name that might wrap to multiple lines' },
      { ...mockUser, id: '2', name: 'Another very long user name for testing purposes', email: 'long@example.com' },
    ]
    
    render(<UserList users={usersWithLongNames} {...defaultProps} />)
    
    expect(screen.getByText('This is a very long user name that might wrap to multiple lines')).toBeInTheDocument()
    expect(screen.getByText('Another very long user name for testing purposes')).toBeInTheDocument()
  })

  it('handles users with long email addresses gracefully', () => {
    const usersWithLongEmails = [
      { ...mockUser, email: 'this.is.a.very.long.email.address@example.com' },
      { ...mockUser, id: '2', name: 'Jane', email: 'another.very.long.email.address@example.com' },
    ]
    
    render(<UserList users={usersWithLongEmails} {...defaultProps} />)
    
    expect(screen.getByText('this.is.a.very.long.email.address@example.com')).toBeInTheDocument()
    expect(screen.getByText('another.very.long.email.address@example.com')).toBeInTheDocument()
  })
}) 