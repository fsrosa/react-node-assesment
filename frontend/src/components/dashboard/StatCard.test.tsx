import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils'
import StatCard from './StatCard'

describe('StatCard', () => {
  const defaultProps = {
    title: 'Total Users',
    value: 42,
    icon: 'Users',
    color: 'bg-blue-500',
  }

  it('renders title and value correctly', () => {
    render(<StatCard {...defaultProps} />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders with different props', () => {
    const props = {
      title: 'Completed Tasks',
      value: 15,
      icon: 'CheckSquare',
      color: 'bg-green-500',
    }
    
    render(<StatCard {...props} />)
    
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('applies correct color classes', () => {
    render(<StatCard title="Total Users" value={42} icon="Users" color="bg-blue-500" />)
    
    const iconContainer = screen.getByText('42').closest('.flex')?.querySelector('.p-3')
    expect(iconContainer).toHaveClass('bg-blue-500')
  })

  it('renders different icons correctly', () => {
    const icons = ['Users', 'CheckSquare', 'Clock', 'AlertTriangle']
    
    icons.forEach(icon => {
      const { unmount } = render(
        <StatCard title="Test" value={42} icon={icon} color="bg-blue-500" />
      )
      
      // Check that the icon container exists
      const iconContainer = screen.getByText('42').closest('.flex')?.querySelector('.p-3')
      expect(iconContainer).toBeInTheDocument()

      unmount()
    })
  })

  it('renders with zero value', () => {
    render(<StatCard {...defaultProps} value={0} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders with large numbers', () => {
    render(<StatCard {...defaultProps} value={999999} />)
    
    expect(screen.getByText('999999')).toBeInTheDocument()
  })

  it('renders with different color schemes', () => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500']
    
    colors.forEach(color => {
      const { unmount } = render(
        <StatCard title="Test" value={42} icon="Users" color={color} />
      )

      const iconContainer = screen.getByText('42').closest('.flex')?.querySelector('.p-3')
      expect(iconContainer).toHaveClass(color)

      unmount()
    })
  })

  it('has correct layout structure', () => {
    render(<StatCard {...defaultProps} />)
    
    // Check that the main card container exists
    const card = screen.getByText('Total Users').closest('.bg-white')
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow', 'p-6')
    
    // Check that the flex container exists
    const flexContainer = screen.getByText('Total Users').closest('.flex')
    expect(flexContainer).toHaveClass('flex', 'items-center')
  })

  it('renders icon with correct styling', () => {
    render(<StatCard title="Total Users" value={42} icon="Users" color="bg-blue-500" />)
    
    const iconContainer = screen.getByText('42').closest('.flex')?.querySelector('.p-3')
    expect(iconContainer).toHaveClass('p-3', 'rounded-full', 'bg-blue-500')
  })

  it('renders text content with correct styling', () => {
    render(<StatCard {...defaultProps} />)
    
    const title = screen.getByText('Total Users')
    expect(title).toHaveClass('text-sm', 'font-medium', 'text-gray-600')
    
    const value = screen.getByText('42')
    expect(value).toHaveClass('text-2xl', 'font-semibold', 'text-gray-900')
  })

  it('handles different title lengths', () => {
    const longTitle = 'This is a very long title that might wrap to multiple lines'
    render(<StatCard {...defaultProps} title={longTitle} />)
    
    expect(screen.getByText(longTitle)).toBeInTheDocument()
  })

  it('renders with all supported icons', () => {
    const testCases = [
      { icon: 'Users', title: 'Users' },
      { icon: 'CheckSquare', title: 'Tasks' },
      { icon: 'Clock', title: 'Time' },
      { icon: 'AlertTriangle', title: 'Alerts' },
    ]
    
    testCases.forEach(({ icon, title }) => {
      const { unmount } = render(<StatCard {...defaultProps} icon={icon} title={title} />)
      
      expect(screen.getByText(title)).toBeInTheDocument()
      
      unmount()
    })
  })
}) 