import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, Task } from '../types';
import { userApi, taskApi } from '../services/api';

interface DataContextType {
  users: User[];
  tasks: Task[];
  loading: boolean;
  refreshUsers: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const refreshUsers = async () => {
    await fetchUsers();
  };

  const refreshTasks = async () => {
    await fetchTasks();
  };

  const refreshAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchTasks()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const value: DataContextType = {
    users,
    tasks,
    loading,
    refreshUsers,
    refreshTasks,
    refreshAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 