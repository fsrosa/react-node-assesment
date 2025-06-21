import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui';
import type { Task, User, CreateTaskData } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  editingTask: Task | null;
  formData: CreateTaskData;
  users: User[];
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onFormDataChange: (field: keyof CreateTaskData, value: string) => void;
}

export default function TaskModal({
  isOpen,
  editingTask,
  formData,
  users,
  error,
  isSubmitting,
  onSubmit,
  onClose,
  onFormDataChange,
}: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingTask ? 'Edit Task' : 'Add Task'}
        </h3>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormDataChange('title', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormDataChange('description', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => onFormDataChange('status', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => onFormDataChange('priority', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => onFormDataChange('dueDate', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign to User</label>
            <select
              value={formData.userId}
              onChange={(e) => onFormDataChange('userId', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {editingTask ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 