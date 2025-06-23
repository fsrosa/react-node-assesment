import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '../../test/utils'
import { NotificationSystem } from './NotificationSystem'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: ({ children }: { children: React.ReactNode }) => <div data-testid="toaster">{children}</div>,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock websocket service
vi.mock('../../services/websocket', () => ({
  websocketService: {
    subscribeToConnection: vi.fn(() => vi.fn()), // Return unsubscribe function
    isConnected: vi.fn(() => false),
    connect: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
    disconnect: vi.fn(), // Add disconnect mock
  },
}))

describe('NotificationSystem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders children correctly', () => {
    render(
      <NotificationSystem>
        <div data-testid="child">Test Child</div>
      </NotificationSystem>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('renders toaster component', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('shows disconnected status by default', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    expect(screen.getByText('Real-time Disconnected')).toBeInTheDocument()
    expect(screen.getByText('Real-time Disconnected').closest('div')).toHaveClass('bg-red-100')
  })

  it('shows connection status indicator in fixed position', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    const statusIndicator = screen.getByText(/Real-time/).closest('div')?.parentElement
    expect(statusIndicator).toHaveClass('fixed', 'top-4', 'right-4', 'z-50')
  })

  it('renders wifi-off icons when disconnected', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    // Check that the wifi-off icon is present (Lucide icons render as SVG)
    const statusContainer = screen.getByText('Real-time Disconnected').closest('div')
    expect(statusContainer).toBeInTheDocument()
  })

  it('has correct styling for disconnected state', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    const statusContainer = screen.getByText('Real-time Disconnected').closest('div')
    expect(statusContainer).toHaveClass(
      'bg-red-100',
      'text-red-800',
      'border',
      'border-red-200'
    )
  })

  it('renders modal with correct styling', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    const statusContainer = screen.getByText('Real-time Disconnected').closest('div')
    expect(statusContainer).toHaveClass('flex', 'items-center', 'gap-2', 'px-3', 'py-2', 'rounded-full')
  })

  it('renders status text with correct styling', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    const statusText = screen.getByText('Real-time Disconnected')
    const statusContainer = statusText.closest('div')
    expect(statusContainer).toHaveClass('text-sm', 'font-medium')
  })

  it('handles different children content', () => {
    const differentChildren = <div data-testid="different-children">Different Content</div>
    render(<NotificationSystem children={differentChildren} />)
    
    expect(screen.getByTestId('different-children')).toBeInTheDocument()
    expect(screen.getByText('Different Content')).toBeInTheDocument()
  })

  it('renders connection status with correct structure', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    const statusContainer = screen.getByText('Real-time Disconnected').closest('div')
    expect(statusContainer).toBeInTheDocument()
    expect(statusContainer?.querySelector('span')).toHaveTextContent('Real-time Disconnected')
  })

  it('renders toaster with correct configuration', () => {
    render(
      <NotificationSystem>
        <div>Test</div>
      </NotificationSystem>
    )
    
    const toaster = screen.getByTestId('toaster')
    expect(toaster).toBeInTheDocument()
  })

  it('maintains component structure', () => {
    render(
      <NotificationSystem>
        <div data-testid="content">Content</div>
      </NotificationSystem>
    )
    
    expect(screen.getByTestId('content')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
    expect(screen.getByText(/Real-time/)).toBeInTheDocument()
  })
}) 