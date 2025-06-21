import { Edit, Trash2, User as UserIcon } from 'lucide-react';
import type { User } from '../../types';
import { Button } from '../ui';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isSubmitting: boolean;
  isDeleting: boolean;
}

export default function UserCard({ 
  user, 
  onEdit, 
  onDelete, 
  isSubmitting, 
  isDeleting 
}: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-full">
            <UserIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => onEdit(user)}
            variant="secondary"
            size="sm"
            disabled={isSubmitting || isDeleting}
            className="p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDelete(user.id)}
            variant="danger"
            size="sm"
            disabled={isSubmitting || isDeleting}
            loading={isDeleting}
            className="p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-400">
        Created: {new Date(user.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
} 