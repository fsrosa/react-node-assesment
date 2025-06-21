import { useState, useEffect } from 'react';
import type { User, Task, Priority } from '../types';
import { userApi, taskApi } from '../services/api';

export function useDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [usersData, tasksData] = await Promise.all([
        userApi.getAll(),
        taskApi.getAll(),
      ]);
      setUsers(usersData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStats = () => [
    {
      title: 'Total Users',
      value: users.length,
      icon: 'Users',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: 'CheckSquare',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Tasks',
      value: tasks.filter(task => task.status === 'PENDING').length,
      icon: 'Clock',
      color: 'bg-yellow-500',
    },
    {
      title: 'High/Urgent Priority',
      value: tasks.filter(task => task.priority === 'HIGH' || task.priority === 'URGENT').length,
      icon: 'AlertTriangle',
      color: 'bg-red-500',
    },
  ];

  const getRecentTasks = () => {
    return tasks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    // State
    users,
    tasks,
    loading,
    
    // Computed values
    stats: getStats(),
    recentTasks: getRecentTasks(),
    
    // Utilities
    getPriorityColor,
  };
} 