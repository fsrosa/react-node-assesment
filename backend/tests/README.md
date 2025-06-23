# Backend Testing Guide

This directory contains comprehensive automated tests for the backend API, covering unit tests, integration tests, and middleware tests.

## Test Structure

```
tests/
├── setup.ts                 # Global test setup and configuration
├── utils/
│   └── testHelpers.ts       # Common test utilities and mock helpers
├── unit/
│   ├── services/
│   │   ├── UserService.test.ts
│   │   └── TaskService.test.ts
│   └── middleware/
│       ├── validation.test.ts
│       └── errorHandler.test.ts
└── integration/
    ├── userRoutes.test.ts
    └── taskRoutes.test.ts
```

## Test Categories

### 1. Unit Tests (`tests/unit/`)
- **Services**: Test business logic in isolation with mocked dependencies
- **Middleware**: Test validation and error handling middleware
- **Repositories**: Test data access layer (if needed)

### 2. Integration Tests (`tests/integration/`)
- **API Routes**: Test complete HTTP endpoints with mocked database
- **Request/Response Flow**: Test the full request handling pipeline

### 3. Test Utilities (`tests/utils/`)
- **Mock Helpers**: Common mock objects and functions
- **Test Data**: Factory functions for creating test data

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Specific Test Categories
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests only
npm run test:e2e
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- TypeScript support with `ts-jest`
- Coverage reporting
- Test timeout: 10 seconds
- Setup file: `tests/setup.ts`

### Environment Variables
Tests use a separate test database configuration. Create a `.env.test` file:
```
DATABASE_URL="postgresql://test:test@localhost:5432/task_management_test"
PORT=3001
NODE_ENV=test
```

## Writing Tests

### Unit Test Example
```typescript
import { UserService } from '../../src/services/UserService';
import { createMockPrismaClient, createMockUser } from '../utils/testHelpers';

describe('UserService', () => {
  let userService: UserService;
  let mockPrismaClient: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrismaClient = createMockPrismaClient();
    userService = new UserService(mockPrismaClient);
  });

  it('should create a user successfully', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    const expectedUser = createMockUser(userData);

    mockPrismaClient.user.create.mockResolvedValue(expectedUser);

    const result = await userService.createUser(userData);

    expect(result).toEqual(expectedUser);
    expect(mockPrismaClient.user.create).toHaveBeenCalledWith(userData);
  });
});
```

### Integration Test Example
```typescript
import request from 'supertest';
import app from '../../src/app';

describe('User Routes Integration Tests', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(userData.email);
  });
});
```

## Testing Best Practices

### 1. Test Organization
- Use descriptive test names that explain the expected behavior
- Group related tests using `describe` blocks
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Mocking
- Mock external dependencies (database, external APIs)
- Use the provided test utilities for consistent mocking
- Avoid mocking the code under test

### 3. Test Data
- Use factory functions for creating test data
- Keep test data realistic but minimal
- Use meaningful test values

### 4. Assertions
- Test both happy path and error scenarios
- Verify function calls and their parameters
- Check response status codes and body content

### 5. Coverage
- Aim for high test coverage (80%+)
- Focus on critical business logic
- Test edge cases and error conditions

## Test Utilities

### Mock Helpers
- `createMockPrismaClient()`: Creates a mocked Prisma client
- `createMockUser()`: Creates a mock user object
- `createMockTask()`: Creates a mock task object
- `createMockRequest()`: Creates a mock Express request
- `createMockResponse()`: Creates a mock Express response

### Common Patterns
```typescript
// Mocking repository methods
jest.spyOn(userRepository, 'create').mockResolvedValue(expectedUser);

// Testing error scenarios
await expect(userService.createUser(invalidData)).rejects.toThrow('Error message');

// Verifying function calls
expect(mockRepository.create).toHaveBeenCalledWith(expectedData);
```

## Continuous Integration

Tests are automatically run in CI/CD pipelines:
- All tests must pass before deployment
- Coverage reports are generated
- Test results are reported in pull requests

## Troubleshooting

### Common Issues
1. **TypeScript Errors**: Ensure all imports are correct and types match
2. **Mock Issues**: Check that mocks are properly set up in `beforeEach`
3. **Async Tests**: Use `async/await` for asynchronous test functions
4. **Database Issues**: Ensure test database is properly configured

### Debugging
- Use `console.log` in tests for debugging (will be suppressed in normal runs)
- Run individual test files: `npm test -- UserService.test.ts`
- Use Jest's `--verbose` flag for more detailed output 