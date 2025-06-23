import { useData } from '../context/DataContext';
import { LoadingSpinner, StatsGrid, RecentTasks } from '../components';
import type { Priority } from '../types';

export default function Dashboard() {
  const { users, tasks, loading, error } = useData();

  // Calculate stats
  const stats = [
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
      title: 'Completed Tasks',
      value: tasks.filter(task => task.status === 'COMPLETED').length,
      icon: 'CheckSquare',
      color: 'bg-green-500',
    },
    {
      title: 'Pending Tasks',
      value: tasks.filter(task => task.status === 'PENDING').length,
      icon: 'Clock',
      color: 'bg-yellow-500',
    },
  ];

  // Get recent tasks (last 5)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Utility function for priority colors
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Real-time overview of your task management system</p>
      </div>

      <StatsGrid stats={stats} />

      <RecentTasks tasks={recentTasks} getPriorityColor={getPriorityColor} />
    </div>
  );
} 