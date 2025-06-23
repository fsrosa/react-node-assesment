import { describe, it, expect } from 'vitest'
import { render, screen } from '../../test/utils'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByTestId('spinner-icon')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Please wait..." />)
    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    expect(screen.getByTestId('spinner-icon')).toHaveClass('h-4 w-4')
    expect(screen.getByText('Loading...')).toHaveClass('text-sm')

    rerender(<LoadingSpinner size="lg" />)
    expect(screen.getByTestId('spinner-icon')).toHaveClass('h-8 w-8')
    expect(screen.getByText('Loading...')).toHaveClass('text-xl')
  })

  it('has correct container structure', () => {
    render(<LoadingSpinner />)
    const spinnerText = screen.getByText('Loading...')
    const spinnerWrapper = spinnerText.closest('div')
    const container = spinnerWrapper?.parentElement?.parentElement
    expect(container).toHaveClass('flex items-center justify-center h-64')
  })

  it('has correct spinner wrapper structure', () => {
    render(<LoadingSpinner />)
    const spinnerWrapper = screen.getByTestId('spinner-icon').closest('div')
    expect(spinnerWrapper).toHaveClass('flex items-center space-x-3')
  })
}) 