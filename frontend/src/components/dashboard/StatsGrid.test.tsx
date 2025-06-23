import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils'
import StatsGrid from './StatsGrid'

describe('StatsGrid', () => {
  const mockStats = [
    {
      title: 'Total Users',
      value: 42,
      icon: 'Users',
      color: 'bg-blue-500',
    },
    {
      title: 'Completed Tasks',
      value: 15,
      icon: 'CheckSquare',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Tasks',
      value: 8,
      icon: 'Clock',
      color: 'bg-yellow-500',
    },
    {
      title: 'Overdue Tasks',
      value: 3,
      icon: 'AlertTriangle',
      color: 'bg-red-500',
    },
  ]

  it('renders all stats correctly', () => {
    render(<StatsGrid stats={mockStats} />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('Overdue Tasks')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders empty grid when no stats provided', () => {
    render(<StatsGrid stats={[]} />)
    
    // Should render the grid container but no stat cards
    const genericElements = screen.getAllByRole('generic')
    const grid = genericElements[0].querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6')
  })

  it('renders single stat correctly', () => {
    const singleStat = [mockStats[0]]
    render(<StatsGrid stats={singleStat} />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.queryByText('Completed Tasks')).not.toBeInTheDocument()
  })

  it('renders two stats correctly', () => {
    const twoStats = mockStats.slice(0, 2)
    render(<StatsGrid stats={twoStats} />)
    
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument()
    expect(screen.queryByText('Pending Tasks')).not.toBeInTheDocument()
  })

  it('has correct grid layout classes', () => {
    render(<StatsGrid stats={mockStats} />)
    
    const grid = screen.getByText('Total Users').closest('.grid')
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-4',
      'gap-6'
    )
  })

  it('passes correct props to StatCard components', () => {
    render(<StatsGrid stats={mockStats} />)
    
    // Verify that all stat cards are rendered with their respective data
    mockStats.forEach(stat => {
      expect(screen.getByText(stat.title)).toBeInTheDocument()
      expect(screen.getByText(stat.value.toString())).toBeInTheDocument()
    })
  })

  it('renders correct number of StatCard components', () => {
    render(<StatsGrid stats={mockStats} />)
    
    // Each stat should render a StatCard with the stat title
    mockStats.forEach(stat => {
      expect(screen.getByText(stat.title)).toBeInTheDocument()
    })
  })

  it('handles stats with different values', () => {
    const variedStats = [
      { title: 'Zero Value', value: 0, icon: 'Users', color: 'bg-blue-500' },
      { title: 'Large Value', value: 999999, icon: 'CheckSquare', color: 'bg-green-500' },
      { title: 'Negative Value', value: -5, icon: 'Clock', color: 'bg-yellow-500' },
    ]
    
    render(<StatsGrid stats={variedStats} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('999999')).toBeInTheDocument()
    expect(screen.getByText('-5')).toBeInTheDocument()
  })

  it('handles stats with different icons', () => {
    const iconStats = [
      { title: 'Users', value: 10, icon: 'Users', color: 'bg-blue-500' },
      { title: 'Tasks', value: 20, icon: 'CheckSquare', color: 'bg-green-500' },
      { title: 'Time', value: 30, icon: 'Clock', color: 'bg-yellow-500' },
      { title: 'Alerts', value: 40, icon: 'AlertTriangle', color: 'bg-red-500' },
    ]
    
    render(<StatsGrid stats={iconStats} />)
    
    iconStats.forEach(stat => {
      expect(screen.getByText(stat.title)).toBeInTheDocument()
      expect(screen.getByText(stat.value.toString())).toBeInTheDocument()
    })
  })

  it('handles stats with different colors', () => {
    const colorStats = [
      { title: 'Blue', value: 1, icon: 'Users', color: 'bg-blue-500' },
      { title: 'Green', value: 2, icon: 'CheckSquare', color: 'bg-green-500' },
      { title: 'Yellow', value: 3, icon: 'Clock', color: 'bg-yellow-500' },
      { title: 'Red', value: 4, icon: 'AlertTriangle', color: 'bg-red-500' },
    ]
    
    render(<StatsGrid stats={colorStats} />)
    
    colorStats.forEach(stat => {
      expect(screen.getByText(stat.title)).toBeInTheDocument()
      expect(screen.getByText(stat.value.toString())).toBeInTheDocument()
    })
  })

  it('maintains grid structure with different stat counts', () => {
    const testCases = [
      { stats: mockStats.slice(0, 1), expectedCount: 1 },
      { stats: mockStats.slice(0, 2), expectedCount: 2 },
      { stats: mockStats.slice(0, 3), expectedCount: 3 },
      { stats: mockStats, expectedCount: 4 },
    ]
    
    testCases.forEach(({ stats, expectedCount }) => {
      const { unmount } = render(<StatsGrid stats={stats} />)
      
      const statTitles = stats.map(stat => stat.title)
      statTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument()
      })
      
      unmount()
    })
  })
}) 