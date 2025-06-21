import { useDashboard } from '../hooks/useDashboard';
import { LoadingSpinner, StatsGrid, RecentTasks } from '../components';

export default function Dashboard() {
  const { loading, stats, recentTasks, getPriorityColor } = useDashboard();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Home</h2>
        <p className="text-gray-600">Overview of your task management system</p>
      </div>

      <StatsGrid stats={stats} />

      <RecentTasks tasks={recentTasks} getPriorityColor={getPriorityColor} />
    </div>
  );
} 