import { useState, useEffect } from 'react';
import { Users, CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import type { User, Task } from '../types';
import { userApi, taskApi } from '../services/api';

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: CheckSquare,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Tasks',
      value: tasks.filter(task => task.status === 'PENDING').length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'High/Urgent Priority',
      value: tasks.filter(task => task.priority === 'HIGH' || task.priority === 'URGENT').length,
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  const recentTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Overview of your task management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTasks.length === 0 ? (
            <div className="px-6 py-4 text-gray-500">No tasks found</div>
          ) : (
            recentTasks.map((task) => (
              <div key={task.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500">
                      {task.user?.name || 'Unassigned'} • {task.status}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'URGENT'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'HIGH'
                          ? 'bg-orange-100 text-orange-800'
                          : task.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 