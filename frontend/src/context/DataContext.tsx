import { createContext, useContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { ReactNode } from 'react';
import type { User, Task, CreateUserData, CreateTaskData, UpdateUserData, UpdateTaskData } from '../types';
import { userApi, taskApi } from '../services/api';
import { websocketService, type DataChangeEvent } from '../services/websocket';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

interface DataContextType {
  users: User[];
  tasks: Task[];
  loading: boolean;
  error: Error | null;
  refreshUsers: () => void;
  refreshTasks: () => void;
  refreshAll: () => void;
  createUser: (user: CreateUserData) => Promise<User>;
  updateUser: (id: string, user: UpdateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<boolean>;
  createTask: (task: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, task: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

function DataProviderContent({ children }: DataProviderProps) {
  const queryClient = useQueryClient();

  // Queries
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAll,
  });

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getAll,
  });

  // User mutations with optimistic updates
  const createUserMutation = useMutation({
    mutationFn: userApi.create,
    onMutate: async (newUser: CreateUserData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['users'] });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData(['users']);

      // Optimistically update to the new value
      queryClient.setQueryData(['users'], (old: User[] = []) => [
        ...old,
        { 
          ...newUser, 
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as User,
      ]);

      return { previousUsers };
    },
    onError: (_err: Error, _newUser: CreateUserData, context: any) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      toast.error('Failed to create user');
    },
    onSuccess: (_newUser: User) => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UpdateUserData }) =>
      userApi.update(id, user),
    onMutate: async ({ id, user }: { id: string; user: UpdateUserData }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: User[] = []) =>
        old.map((u) => (u.id === id ? { ...u, ...user, updatedAt: new Date().toISOString() } : u))
      );

      return { previousUsers };
    },
    onError: (_err: Error, _variables: { id: string; user: UpdateUserData }, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      toast.error('Failed to update user');
    },
    onSuccess: (_updatedUser: User) => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userApi.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: User[] = []) =>
        old.filter((u) => u.id !== id)
      );

      return { previousUsers };
    },
    onError: (_err: Error, _id: string, context: any) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      toast.error('Failed to delete user');
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Task mutations with optimistic updates
  const createTaskMutation = useMutation({
    mutationFn: taskApi.create,
    onMutate: async (newTask: CreateTaskData) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] = []) => [
        ...old,
        { 
          ...newTask, 
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Task,
      ]);

      return { previousTasks };
    },
    onError: (_err: Error, _newTask: CreateTaskData, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast.error('Failed to create task');
    },
    onSuccess: (_newTask: Task) => {
      toast.success('Task created successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: UpdateTaskData }) =>
      taskApi.update(id, task),
    onMutate: async ({ id, task }: { id: string; task: UpdateTaskData }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] = []) =>
        old.map((t) => (t.id === id ? { ...t, ...task, updatedAt: new Date().toISOString() } : t))
      );

      return { previousTasks };
    },
    onError: (_err: Error, _variables: { id: string; task: UpdateTaskData }, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast.error('Failed to update task');
    },
    onSuccess: (_updatedTask: Task) => {
      toast.success('Task updated successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old: Task[] = []) =>
        old.filter((t) => t.id !== id)
      );

      return { previousTasks };
    },
    onError: (_err: Error, _id: string, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast.error('Failed to delete task');
    },
    onSuccess: () => {
      toast.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // WebSocket event handling
  useEffect(() => {
    websocketService.connect();

    const unsubscribeUser = websocketService.subscribe('USER', (event: DataChangeEvent) => {
      console.log('User event received:', event);
      
      // Show toast notification for real-time updates from other clients
      switch (event.type) {
        case 'CREATE':
          queryClient.setQueryData(['users'], (old: User[] = []) => {
            const exists = old.some(u => u.id === event.data.id);
            if (!exists) {
              toast.success(`New user "${event.data.name}" was added by another user`, {
                icon: '👤',
                duration: 4000,
              });
              return [...old, event.data];
            }
            return old;
          });
          break;
        case 'UPDATE':
          queryClient.setQueryData(['users'], (old: User[] = []) => {
            const updated = old.map(u => u.id === event.data.id ? event.data : u);
            const user = old.find(u => u.id === event.data.id);
            if (user && user.name !== event.data.name) {
              toast.success(`User "${user.name}" was updated to "${event.data.name}" by another user`, {
                icon: '✏️',
                duration: 4000,
              });
            }
            return updated;
          });
          break;
        case 'DELETE':
          queryClient.setQueryData(['users'], (old: User[] = []) => {
            const deletedUser = old.find(u => u.id === event.data.id);
            if (deletedUser) {
              toast.error(`User "${deletedUser.name}" was deleted by another user`, {
                icon: '🗑️',
                duration: 4000,
              });
            }
            return old.filter(u => u.id !== event.data.id);
          });
          break;
      }
    });

    const unsubscribeTask = websocketService.subscribe('TASK', (event: DataChangeEvent) => {
      console.log('Task event received:', event);
      
      // Show toast notification for real-time updates from other clients
      switch (event.type) {
        case 'CREATE':
          queryClient.setQueryData(['tasks'], (old: Task[] = []) => {
            const exists = old.some(t => t.id === event.data.id);
            if (!exists) {
              toast.success(`New task "${event.data.title}" was added by another user`, {
                icon: '📝',
                duration: 4000,
              });
              return [...old, event.data];
            }
            return old;
          });
          break;
        case 'UPDATE':
          queryClient.setQueryData(['tasks'], (old: Task[] = []) => {
            const updated = old.map(t => t.id === event.data.id ? event.data : t);
            const task = old.find(t => t.id === event.data.id);
            if (task && task.title !== event.data.title) {
              toast.success(`Task "${task.title}" was updated to "${event.data.title}" by another user`, {
                icon: '✏️',
                duration: 4000,
              });
            } else if (task && task.status !== event.data.status) {
              toast.success(`Task "${task.title}" status changed from "${task.status}" to "${event.data.status}" by another user`, {
                icon: '🔄',
                duration: 4000,
              });
            }
            return updated;
          });
          break;
        case 'DELETE':
          queryClient.setQueryData(['tasks'], (old: Task[] = []) => {
            const deletedTask = old.find(t => t.id === event.data.id);
            if (deletedTask) {
              toast.error(`Task "${deletedTask.title}" was deleted by another user`, {
                icon: '🗑️',
                duration: 4000,
              });
            }
            return old.filter(t => t.id !== event.data.id);
          });
          break;
      }
    });

    return () => {
      unsubscribeUser();
      unsubscribeTask();
      websocketService.disconnect();
    };
  }, [queryClient]);

  const value: DataContextType = {
    users,
    tasks,
    loading: usersLoading || tasksLoading,
    error: usersError || tasksError,
    refreshUsers: () => refetchUsers(),
    refreshTasks: () => refetchTasks(),
    refreshAll: () => {
      refetchUsers();
      refetchTasks();
    },
    createUser: (user: CreateUserData) => createUserMutation.mutateAsync(user),
    updateUser: (id: string, user: UpdateUserData) => updateUserMutation.mutateAsync({ id, user }),
    deleteUser: (id: string) => deleteUserMutation.mutateAsync(id),
    createTask: (task: CreateTaskData) => createTaskMutation.mutateAsync(task),
    updateTask: (id: string, task: UpdateTaskData) => updateTaskMutation.mutateAsync({ id, task }),
    deleteTask: (id: string) => deleteTaskMutation.mutateAsync(id),
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function DataProvider({ children }: DataProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderContent>{children}</DataProviderContent>
    </QueryClientProvider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 