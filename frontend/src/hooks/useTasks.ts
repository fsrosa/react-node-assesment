import { useState, useEffect } from 'react';
import type { Task, User, CreateTaskData, TaskStatus, Priority } from '../types';
import { TaskStatus as TaskStatusEnum, Priority as PriorityEnum } from '../types';
import { taskApi, userApi } from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: TaskStatusEnum.PENDING,
    priority: PriorityEnum.MEDIUM,
    dueDate: '',
    userId: '',
  });

  const fetchData = async () => {
    try {
      const [tasksData, usersData] = await Promise.all([
        taskApi.getAll(),
        userApi.getAll(),
      ]);
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    
    try {
      const processedData = {
        ...formData,
        dueDate: formData.dueDate || undefined
      };

      if (editingTask) {
        await taskApi.update(editingTask.id, processedData);
      } else {
        await taskApi.create(processedData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: TaskStatusEnum.PENDING,
        priority: PriorityEnum.MEDIUM,
        dueDate: '',
        userId: '',
      });
      fetchData();
    } catch (error: any) {
      console.error('Error saving task:', error);
      const errorMessage = error.response?.data?.errors[0].message || 
                          'An unexpected error occurred while saving the task.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setError(null);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      userId: task.userId || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeletingTaskId(id);
      try {
        await taskApi.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setDeletingTaskId(null);
      }
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setError(null);
    setFormData({
      title: '',
      description: '',
      status: TaskStatusEnum.PENDING,
      priority: PriorityEnum.MEDIUM,
      dueDate: '',
      userId: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setError(null);
    setFormData({
      title: '',
      description: '',
      status: TaskStatusEnum.PENDING,
      priority: PriorityEnum.MEDIUM,
      dueDate: '',
      userId: '',
    });
  };

  const updateFormData = (field: keyof CreateTaskData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    // State
    tasks,
    users,
    loading,
    submitting,
    deletingTaskId,
    showModal,
    editingTask,
    error,
    formData,
    
    // Actions
    handleSubmit,
    handleEdit,
    handleDelete,
    openCreateModal,
    closeModal,
    updateFormData,
    
    // Utilities
    getStatusColor,
    getPriorityColor,
  };
} 