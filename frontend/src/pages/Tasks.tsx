import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useData } from '../context/DataContext';
import { LoadingSpinner, TaskList, TaskModal, Button } from '../components';
import type { Task, CreateTaskData } from '../types';
import { TaskStatus, Priority } from '../types';

export default function Tasks() {
  const {
    tasks,
    users,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  } = useData();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const getInitialFormData = (): CreateTaskData => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 1); // Add one day

    return {
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      priority: Priority.LOW,
      dueDate: defaultDueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      userId: '',
    };
  };

  const [formData, setFormData] = useState<CreateTaskData>(getInitialFormData());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData(getInitialFormData());
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData(getInitialFormData());
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      userId: task.userId || (users.length > 0 ? users[0].id : ''),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await createTask(formData);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CreateTaskData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Utility functions for colors
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">Manage your tasks with real-time updates</p>
        </div>
        <Button
          onClick={openCreateModal}
          disabled={isSubmitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSubmitting={isSubmitting}
        deletingTaskId={null}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />

      <TaskModal
        isOpen={showModal}
        editingTask={editingTask}
        formData={formData}
        users={users}
        error={null}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onClose={closeModal}
        onFormDataChange={updateFormData}
      />
    </div>
  );
} 