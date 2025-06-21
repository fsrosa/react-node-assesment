import { CheckSquare } from 'lucide-react';
import type { Task, TaskStatus, Priority } from '../types';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isSubmitting: boolean;
  deletingTaskId: string | null;
  getStatusColor: (status: TaskStatus) => string;
  getPriorityColor: (priority: Priority) => string;
}

export default function TaskList({ 
  tasks, 
  onEdit, 
  onDelete, 
  isSubmitting, 
  deletingTaskId,
  getStatusColor,
  getPriorityColor
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
        <p className="text-gray-500">Get started by creating your first task.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          isDeleting={deletingTaskId === task.id}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
        />
      ))}
    </div>
  );
} 