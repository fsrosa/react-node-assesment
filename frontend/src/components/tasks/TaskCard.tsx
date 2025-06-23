import { Edit, Trash2, CheckSquare } from 'lucide-react';
import type { Task, TaskStatus, Priority } from '../../types';
import { Button } from '../ui';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isSubmitting: boolean;
  isDeleting: boolean;
  getStatusColor: (status: TaskStatus) => string;
  getPriorityColor: (priority: Priority) => string;
}

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  isSubmitting, 
  isDeleting,
  getStatusColor,
  getPriorityColor
}: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Assigned to: {task.user?.name || 'Unassigned'}
            </p>
            <div className="flex space-x-2 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                Status: {task.status}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                Priority: {task.priority}
              </span>
            </div>
            {task.dueDate && (
              <p className="text-xs text-gray-400 mt-2">
                Due: {task.dueDate.split('T')[0]}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(task)}
            variant="secondary"
            size="sm"
            disabled={isSubmitting || isDeleting}
            className="p-2"
            aria-label="Edit task"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(task.id)}
            variant="danger"
            size="sm"
            disabled={isSubmitting || isDeleting}
            loading={isDeleting}
            className="p-2"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 