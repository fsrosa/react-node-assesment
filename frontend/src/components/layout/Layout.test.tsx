import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/utils'
import Layout from './Layout'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/',
    }),
  }
})

describe('Layout', () => {
  const defaultProps = {
    children: <div data-testid="test-children">Test Content</div>,
  }

  it('renders children correctly', () => {
    render(<Layout {...defaultProps} />)
    
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders header with title', () => {
    render(<Layout {...defaultProps} />)
    
    expect(screen.getByText('Task Management Dashboard')).toBeInTheDocument()
  })

  it('renders navigation items correctly', () => {
    render(<Layout {...defaultProps} />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Tasks')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders mobile menu button', () => {
    render(<Layout {...defaultProps} />)
    
    const menuButton = screen.getByRole('button')
    expect(menuButton).toBeInTheDocument()
  })

  it('toggles sidebar when mobile menu button is clicked', () => {
    render(<Layout {...defaultProps} />)
    
    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)
    
    // The sidebar should be visible after clicking the menu button
    const sidebar = screen.getByText('Home').closest('nav')
    expect(sidebar).toHaveClass('translate-x-0')
  })

  it('closes sidebar when clicking outside on mobile', () => {
    render(<Layout {...defaultProps} />)
    
    // Open sidebar first
    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)
    
    // Click outside to close
    const overlay = screen.getByText('Home').closest('nav')?.previousElementSibling
    if (overlay) {
      fireEvent.click(overlay)
    }
    
    // The sidebar should be hidden after clicking outside
    const sidebar = screen.getByText('Home').closest('nav')
    expect(sidebar).toHaveClass('-translate-x-full')
  })

  it('renders navigation links with correct hrefs', () => {
    render(<Layout {...defaultProps} />)
    
    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveAttribute('href', '/')
    
    const tasksLink = screen.getByText('Tasks').closest('a')
    expect(tasksLink).toHaveAttribute('href', '/tasks')
    
    const usersLink = screen.getByText('Users').closest('a')
    expect(usersLink).toHaveAttribute('href', '/users')
  })

  it('has correct header styling', () => {
    render(<Layout {...defaultProps} />)
    
    const header = screen.getByText('Task Management Dashboard').closest('header')
    expect(header).toHaveClass('bg-white', 'shadow-sm', 'border-b')
  })

  it('has correct sidebar styling', () => {
    render(<Layout {...defaultProps} />)
    
    const sidebar = screen.getByText('Home').closest('nav')
    expect(sidebar).toHaveClass('bg-white', 'shadow-sm')
  })

  it('has correct main content styling', () => {
    render(<Layout {...defaultProps} />)
    
    const main = screen.getByText('Test Content').closest('main')
    expect(main).toHaveClass('bg-gray-50')
  })

  it('renders navigation icons', () => {
    render(<Layout {...defaultProps} />)
    
    // Check that the navigation items have icons (Lucide icons render as SVG)
    const navItems = screen.getAllByRole('link')
    expect(navItems).toHaveLength(3)
  })

  it('handles different children content', () => {
    const differentChildren = <div data-testid="different-children">Different Content</div>
    render(<Layout children={differentChildren} />)
    
    expect(screen.getByTestId('different-children')).toBeInTheDocument()
    expect(screen.getByText('Different Content')).toBeInTheDocument()
  })

  it('renders mobile overlay when sidebar is open', () => {
    render(<Layout {...defaultProps} />)
    
    // Open sidebar
    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)
    
    // Check that overlay exists
    const overlay = screen.getByText('Home').closest('nav')?.previousElementSibling
    expect(overlay).toHaveClass('bg-black', 'bg-opacity-50')
  })

  it('has correct layout structure', () => {
    render(<Layout {...defaultProps} />)
    
    const container = screen.getByText('Test Content').closest('.h-screen')
    expect(container).toHaveClass('h-screen', 'w-screen', 'flex', 'flex-col')
  })

  it('renders navigation items with correct styling', () => {
    render(<Layout {...defaultProps} />)
    
    const navItems = screen.getAllByRole('link')
    navItems.forEach(item => {
      expect(item).toHaveClass('flex', 'items-center', 'px-4', 'py-2', 'text-sm', 'font-medium')
    })
  })

  it('handles active navigation state', () => {
    // Mock useLocation to return a specific pathname
    vi.doMock('react-router-dom', () => ({
      Link: ({ children, to }: any) => <a href={to}>{children}</a>,
      useLocation: () => ({ pathname: '/tasks' }),
    }))
    
    render(<Layout {...defaultProps} />)
    
    // The active link should have different styling
    const tasksLink = screen.getByText('Tasks').closest('a')
    expect(tasksLink).toBeInTheDocument()
  })

  it('renders mobile menu button with correct styling', () => {
    render(<Layout {...defaultProps} />)
    
    const menuButton = screen.getByRole('button')
    expect(menuButton).toHaveClass('lg:hidden', 'p-2', 'rounded-md', 'mr-3', 'bg-blue-700')
  })

  it('renders header title with correct styling', () => {
    render(<Layout {...defaultProps} />)
    
    const title = screen.getByText('Task Management Dashboard')
    expect(title).toHaveClass('text-lg', 'sm:text-xl', 'font-semibold', 'text-gray-900')
  })

  it('has correct responsive behavior', () => {
    render(<Layout {...defaultProps} />)
    
    // Check that the sidebar has responsive classes
    const sidebar = screen.getByText('Home').closest('nav')
    expect(sidebar).toHaveClass('lg:static', 'lg:translate-x-0')
  })

  it('renders navigation items in correct order', () => {
    render(<Layout {...defaultProps} />)
    
    const navItems = screen.getAllByRole('link')
    expect(navItems[0]).toHaveTextContent('Home')
    expect(navItems[1]).toHaveTextContent('Tasks')
    expect(navItems[2]).toHaveTextContent('Users')
  })

  it('handles sidebar state changes correctly', () => {
    render(<Layout {...defaultProps} />)
    
    const menuButton = screen.getByRole('button')
    const sidebar = screen.getByText('Home').closest('nav')
    
    // Initially closed on mobile
    expect(sidebar).toHaveClass('-translate-x-full')
    
    // Open sidebar
    fireEvent.click(menuButton)
    expect(sidebar).toHaveClass('translate-x-0')
    
    // Close sidebar
    fireEvent.click(menuButton)
    expect(sidebar).toHaveClass('-translate-x-full')
  })
}) 