import { User as UserIcon } from 'lucide-react';
import type { User } from '../types';
import UserCard from './UserCard';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  isSubmitting: boolean;
  deletingUserId: string | null;
}

export default function UserList({ 
  users, 
  onEdit, 
  onDelete, 
  isSubmitting, 
  deletingUserId 
}: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-500">Get started by creating your first user.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          isDeleting={deletingUserId === user.id}
        />
      ))}
    </div>
  );
} 