import React from 'react'
import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DataProvider } from '../context/DataContext'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </DataProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Mock data for tests
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  status: 'pending',
  priority: 'medium',
  assignedTo: '1',
  createdBy: '1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockUsers = [
  mockUser,
  {
    ...mockUser,
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
]

export const mockTasks = [
  mockTask,
  {
    ...mockTask,
    id: '2',
    title: 'Another Task',
    status: 'completed',
  },
] 