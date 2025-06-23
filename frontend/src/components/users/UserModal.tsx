import { AlertCircle } from 'lucide-react';
import { Button } from '../ui';
import type { User, CreateUserData } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  editingUser: User | null;
  formData: CreateUserData;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onFormDataChange: (field: keyof CreateUserData, value: string) => void;
}

export default function UserModal({
  isOpen,
  editingUser,
  formData,
  error,
  isSubmitting,
  onSubmit,
  onClose,
  onFormDataChange,
}: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {editingUser ? 'Edit User' : 'Add User'}
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
        
        <form onSubmit={onSubmit} className="space-y-4" role="form">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="user-name"
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange('name', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="user-email"
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange('email', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-900 focus:bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
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
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 