import type { Task, Priority } from '../../types';

interface RecentTasksProps {
  tasks: Task[];
  getPriorityColor: (priority: Priority) => string;
}

export default function RecentTasks({ tasks, getPriorityColor }: RecentTasksProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">No tasks found</div>
        ) : (
          tasks.map((task) => (
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
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                      task.priority
                    )}`}
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
  );
} 