# React Node Assessment - Task Management System

A full-stack task management application built with React, Node.js, and real-time features. This project demonstrates modern web development practices including clean architecture, dependency injection, real-time updates, and comprehensive testing.

## 🚀 Features

### Core Functionality
- **User Management**: CRUD operations for users with email validation
- **Task Management**: Create, read, update, and delete tasks with status tracking
- **Dashboard**: Real-time statistics and overview of system data
- **Responsive Design**: Modern UI built with Tailwind CSS and React components

### Real-Time Features
- **Live Updates**: WebSocket integration for instant data synchronization
- **Optimistic UI**: Immediate feedback with automatic error recovery
- **Connection Status**: Visual indicators for real-time connection health
- **Event Broadcasting**: Server broadcasts changes to all connected clients
- **Multi-User Support**: Multiple users can see each other's changes in real-time
- **Cross-Tab Updates**: Changes sync across browser tabs
- **Automatic Reconnection**: Handles connection drops gracefully

### Technical Excellence
- **Clean Architecture**: Separation of concerns with repository pattern
- **Dependency Injection**: IoC container for service management
- **Comprehensive Testing**: Unit, integration, and E2E test coverage
- **API Documentation**: Swagger/OpenAPI documentation
- **Type Safety**: Full TypeScript implementation
- **Efficient Caching**: React Query with intelligent cache management
- **Background Refetching**: Keeps data fresh without blocking UI

## 🏗️ Architecture Overview

### Backend Architecture (Node.js + Express + Prisma)

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Controllers (REST API) │  WebSocket Events │  Swagger Docs │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                    │
├─────────────────────────────────────────────────────────────┤
│  UserService │  TaskService │  EventService │  Validation   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Repository Pattern │  Prisma ORM │  PostgreSQL Database    │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture (React + TypeScript)

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Pages │  Components │  Layout │  UI Components             │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    State Management Layer                   │
├─────────────────────────────────────────────────────────────┤
│  React Query │  Context API │  Custom Hooks │  WebSocket    │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  API Service │  WebSocket Service │  Type Definitions       │
└─────────────────────────────────────────────────────────────┘
```

### Real-Time Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   HTTP Server   │    │  Socket.IO      │    │   EventService  │
│   (Express)     │◄──►│   Server        │◄──►│   (Real-time)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │    │   WebSocket     │    │   Broadcasting  │
│   (REST API)    │    │   Events        │    │   (Data Changes)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │  React Query    │    │  Socket.IO      │
│   (Components)  │◄──►│   (Cache)       │◄──►│   Client        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Optimistic    │    │   Background    │    │   Real-time     │
│   Updates       │    │   Sync          │    │   Events        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: Socket.IO
- **Validation**: Express-validator
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with Supertest
- **Development**: ts-node-dev for hot reloading

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Real-time**: Socket.IO Client
- **UI Components**: Custom components with Lucide React icons
- **Testing**: Vitest with React Testing Library
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-node-assesment
```

### 2. Environment Setup

#### Backend Environment
Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/task_management"
PORT=3000
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment
Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Database Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 4. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 5. Start the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📖 Available Scripts

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:unit` | Run only unit tests |
| `npm run test:integration` | Run only integration tests |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database with sample data |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Run ESLint |

## 🔧 Real-Time Implementation

### Backend Implementation

#### 1. EventService (`backend/src/services/EventService.ts`)
```typescript
class EventService {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: { origin: process.env.FRONTEND_URL || "http://localhost:5173" }
    });
  }

  broadcastDataChange(event: DataChangeEvent) {
    this.io?.emit('dataChange', event);
  }

  broadcastUserChange(type: 'CREATE' | 'UPDATE' | 'DELETE', user: any) {
    this.broadcastDataChange({
      type, entity: 'USER', data: user, timestamp: new Date()
    });
  }
}
```

#### 2. Service Layer Integration
- **UserService**: Broadcasts events on user CRUD operations
- **TaskService**: Broadcasts events on task CRUD operations
- **Automatic Event Emission**: Events sent after successful database operations

#### 3. HTTP Server Setup (`backend/src/app.ts`)
```typescript
const httpServer = createServer(app);
eventService.initialize(httpServer);
httpServer.listen(port, () => {
  console.log(`🔌[websocket]: WebSocket server is ready for real-time updates`);
});
```

### Frontend Implementation

#### 1. WebSocket Service (`frontend/src/services/websocket.ts`)
```typescript
class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(event: DataChangeEvent) => void>> = new Map();

  connect() {
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    this.socket.on('dataChange', (event) => this.notifyListeners(event));
  }

  subscribe(eventType: string, callback: (event: DataChangeEvent) => void) {
    // Subscribe to specific entity events (USER, TASK) or all events (*)
  }
}
```

#### 2. Enhanced Data Context (`frontend/src/context/DataContext.tsx`)
```typescript
// React Query Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Optimistic Updates
const createUserMutation = useMutation({
  mutationFn: userApi.create,
  onMutate: async (newUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['users'] });
    
    // Optimistically update cache
    queryClient.setQueryData(['users'], (old: User[] = []) => [
      ...old, { ...newUser, id: `temp-${Date.now()}` } as User,
    ]);
    
    return { previousUsers: queryClient.getQueryData(['users']) };
  },
  onError: (err, newUser, context) => {
    // Rollback on error
    if (context?.previousUsers) {
      queryClient.setQueryData(['users'], context.previousUsers);
    }
  },
});
```

#### 3. Real-time Event Handling
```typescript
useEffect(() => {
  websocketService.connect();

  const unsubscribeUser = websocketService.subscribe('USER', (event) => {
    switch (event.type) {
      case 'CREATE':
        queryClient.setQueryData(['users'], (old: User[] = []) => {
          const exists = old.some(u => u.id === event.data.id);
          return exists ? old : [...old, event.data];
        });
        break;
      case 'UPDATE':
        queryClient.setQueryData(['users'], (old: User[] = []) =>
          old.map(u => u.id === event.data.id ? event.data : u)
        );
        break;
      case 'DELETE':
        queryClient.setQueryData(['users'], (old: User[] = []) =>
          old.filter(u => u.id !== event.data.id)
        );
        break;
    }
  });

  return () => {
    unsubscribeUser();
    websocketService.disconnect();
  };
}, [queryClient]);
```

#### 4. Notification System (`frontend/src/components/ui/NotificationSystem.tsx`)
```typescript
export function NotificationSystem({ children }: NotificationSystemProps) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(websocketService.isConnected());
    };
    
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Connection Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{isConnected ? 'Real-time Connected' : 'Real-time Disconnected'}</span>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" />
      {children}
    </>
  );
}
```

### Testing Real-Time Features

1. **Open Multiple Browser Tabs**
   - Navigate to the application in multiple tabs
   - Create, update, or delete users/tasks in one tab
   - Observe real-time updates in other tabs

2. **Test Connection Status**
   - Check the connection indicator in the top-right corner
   - Disconnect network to see offline status
   - Reconnect to see automatic reconnection

3. **Test Optimistic Updates**
   - Perform actions and observe immediate UI updates
   - Check browser network tab to see background API calls
   - Test error scenarios by temporarily disabling the backend

## 🎯 User Experience Features

### 1. Real-Time Updates
- **Instant Synchronization**: Changes appear immediately across all connected clients
- **Multi-User Support**: Multiple users can see each other's changes in real-time
- **Cross-Tab Updates**: Changes sync across browser tabs

### 2. Optimistic UI
- **Immediate Feedback**: UI responds instantly to user actions
- **Error Handling**: Graceful fallback if operations fail
- **Loading States**: Clear visual feedback during operations

### 3. Smart Caching
- **Reduced API Calls**: Intelligent caching minimizes server requests
- **Background Updates**: Data stays fresh without blocking UI
- **Offline Resilience**: App works with cached data when offline

### 4. User Notifications
- **Success Messages**: Toast notifications for successful operations
- **Error Messages**: Clear error feedback with recovery suggestions
- **Connection Status**: Visual indicator of real-time connection health

## 🏛️ Architectural Decisions & Trade-offs

### 1. Clean Architecture Implementation

**Decision**: Implemented a layered architecture with clear separation of concerns.

**Benefits**:
- **Testability**: Each layer can be tested independently
- **Maintainability**: Changes in one layer don't affect others
- **Scalability**: Easy to add new features or modify existing ones
- **Dependency Inversion**: High-level modules don't depend on low-level modules

**Trade-offs**:
- **Complexity**: More boilerplate code initially
- **Learning Curve**: Team needs to understand architectural patterns

### 2. Repository Pattern with Dependency Injection

**Decision**: Used repository pattern with IoC container for data access.

**Benefits**:
- **Abstraction**: Business logic doesn't depend on specific database implementation
- **Testability**: Easy to mock repositories for unit testing
- **Flexibility**: Can switch database implementations without changing business logic

**Trade-offs**:
- **Overhead**: Additional abstraction layer
- **Complexity**: More interfaces and classes to maintain

### 3. Real-time Updates with WebSocket

**Decision**: Implemented Socket.IO for real-time data synchronization.

**Benefits**:
- **Immediate Updates**: Users see changes instantly
- **Better UX**: No need to refresh pages
- **Collaborative Features**: Multiple users can see changes in real-time

**Trade-offs**:
- **Complexity**: Additional state management complexity
- **Connection Management**: Need to handle connection drops and reconnections
- **Scalability**: WebSocket connections consume server resources

### 4. Optimistic UI Updates

**Decision**: Implemented optimistic updates with React Query.

**Benefits**:
- **Perceived Performance**: UI updates immediately
- **Better UX**: Users get instant feedback
- **Offline Capability**: Can work with cached data

**Trade-offs**:
- **Complexity**: Need to handle rollback scenarios
- **Data Consistency**: Potential for temporary inconsistencies
- **Error Handling**: More complex error recovery logic

### 5. TypeScript Throughout

**Decision**: Used TypeScript for both frontend and backend.

**Benefits**:
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Documentation**: Types serve as living documentation
- **Refactoring Safety**: Safer large-scale refactoring

**Trade-offs**:
- **Learning Curve**: Team needs TypeScript knowledge
- **Build Time**: Additional compilation step
- **Bundle Size**: Slightly larger bundles (mitigated by tree shaking)

### 6. Prisma ORM

**Decision**: Chose Prisma over other ORMs like TypeORM or Sequelize.

**Benefits**:
- **Type Safety**: Generated types from schema
- **Migration System**: Robust database migration handling
- **Developer Experience**: Excellent CLI and tooling
- **Performance**: Efficient query generation

**Trade-offs**:
- **Ecosystem**: Smaller community compared to TypeORM
- **Learning Curve**: Team needs to learn Prisma-specific concepts
- **Vendor Lock-in**: Prisma-specific schema format

### 7. React Query for State Management

**Decision**: Used React Query instead of Redux or Context API alone.

**Benefits**:
- **Server State Management**: Built-in caching and synchronization
- **Background Updates**: Automatic data refetching
- **Optimistic Updates**: Easy implementation of optimistic UI
- **DevTools**: Excellent debugging tools

**Trade-offs**:
- **Bundle Size**: Additional dependency
- **Learning Curve**: Team needs to understand React Query patterns
- **Complexity**: More complex than simple Context API

## 🧪 Testing Strategy

### Backend Testing

- **Unit Tests**: Test individual service methods and utilities
- **Integration Tests**: Test API endpoints with database integration
- **Test Coverage**: Aim for >80% code coverage
- **Test Database**: Separate test database for isolated testing

### Frontend Testing

- **Component Tests**: Test React components in isolation
- **Hook Tests**: Test custom hooks with React Testing Library
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows (planned)

## 📚 API Documentation

Once the backend is running, you can access the API documentation at:

```
http://localhost:3000/api-docs
```

The documentation includes:
- All available endpoints
- Request/response schemas
- Example requests
- Interactive testing interface

## 🔧 Development Guidelines

### Code Style
- **Backend**: ESLint with TypeScript rules
- **Frontend**: ESLint with React and TypeScript rules
- **Formatting**: Prettier for consistent code formatting

### Git Workflow
- **Feature Branches**: Create feature branches for new development
- **Commit Messages**: Use conventional commit format
- **Pull Requests**: Required for all changes

### Database Migrations
- **Schema Changes**: Always create migrations for database changes
- **Seeding**: Use seed scripts for development data
- **Backup**: Regular database backups in production

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run database migrations: `npx prisma migrate deploy`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve the `dist` folder with a static file server
3. Configure environment variables for production API URL

## 🔍 Performance Considerations

### Backend
- **Event Batching**: Consider batching multiple events for high-frequency updates
- **Connection Limits**: Implement connection limits to prevent resource exhaustion
- **Event Filtering**: Filter events based on user permissions and relevance

### Frontend
- **Debouncing**: Debounce rapid user interactions to prevent excessive API calls
- **Pagination**: Implement pagination for large datasets
- **Virtual Scrolling**: Use virtual scrolling for long lists

## 🛡️ Security Considerations

### WebSocket Security
- **Authentication**: Implement JWT-based authentication for WebSocket connections
- **Authorization**: Validate user permissions before broadcasting events
- **Rate Limiting**: Implement rate limiting for WebSocket events

### Data Validation
- **Input Validation**: Validate all data on both client and server
- **XSS Prevention**: Sanitize user input to prevent XSS attacks
- **CSRF Protection**: Implement CSRF protection for API endpoints

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Fails**
   - Check CORS configuration
   - Verify frontend URL in backend environment
   - Check firewall settings

2. **Real-time Updates Not Working**
   - Verify WebSocket connection status
   - Check browser console for errors
   - Ensure backend services are running

3. **Optimistic Updates Not Rolling Back**
   - Check error handling in mutations
   - Verify cache invalidation logic
   - Check React Query configuration

### Debug Tools
- **Browser DevTools**: Network tab for API calls, Console for errors
- **React Query DevTools**: For cache inspection and debugging
- **Socket.IO Debug**: Enable debug mode for WebSocket troubleshooting

## 📈 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Multi-user editing with conflict resolution
- **Push Notifications**: Browser push notifications for important events
- **Offline Support**: Full offline functionality with sync when online
- **Event History**: Audit trail of all data changes
- **Performance Monitoring**: Real-time performance metrics

### Scalability Improvements
- **Redis Pub/Sub**: Use Redis for event distribution across multiple server instances
- **Load Balancing**: Implement WebSocket load balancing
- **Database Optimization**: Optimize database queries and indexing
- **CDN Integration**: Use CDN for static assets


## 📚 Additional Resources

- [Socket.IO Documentation](https://socket.io/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hot Toast Documentation](https://react-hot-toast.com/)
- [Event-Driven Architecture Patterns](https://martinfowler.com/articles/201701-event-driven.html)

---

**Note**: This is a demonstration project showcasing modern full-stack development practices. The architecture and patterns used here can be adapted for production applications with additional considerations for security, performance, and scalability.
