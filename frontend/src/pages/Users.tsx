import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { LoadingSpinner, UserList, UserModal, Button } from '../components';
import type { User, CreateUserData } from '../types';

export default function Users() {
  const {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
  } = useData();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '' });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600">Manage your users with real-time updates</p>
        </div>
        <Button
          onClick={openCreateModal}
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
        deletingUserId={null}
      />

      <UserModal
        isOpen={showModal}
        editingUser={editingUser}
        formData={formData}
        error={null}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={closeModal}
        onFormDataChange={updateFormData}
      />
    </div>
  );
} 