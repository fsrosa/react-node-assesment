import { useState, useEffect } from 'react';
import type { User, CreateUserData } from '../types';
import { userApi } from '../services/api';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
  });

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      if (editingUser) {
        await userApi.update(editingUser.id, formData);
      } else {
        await userApi.create(formData);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ name: '', email: '' });
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.errors[0].message || 
                          'An unexpected error occurred while saving the user.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setError(null);
    setFormData({ name: user.name, email: user.email });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeletingUserId(id);
      try {
        await userApi.delete(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setDeletingUserId(null);
      }
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setError(null);
    setFormData({ name: '', email: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError(null);
    setFormData({ name: '', email: '' });
  };

  const updateFormData = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    // State
    users,
    loading,
    submitting,
    deletingUserId,
    showModal,
    editingUser,
    error,
    formData,
    
    // Actions
    handleSubmit,
    handleEdit,
    handleDelete,
    openCreateModal,
    closeModal,
    updateFormData,
  };
} 