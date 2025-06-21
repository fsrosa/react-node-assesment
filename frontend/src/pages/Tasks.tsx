import { Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { LoadingSpinner, TaskList, TaskModal, Button } from '../components';

export default function Tasks() {
  const {
    tasks,
    users,
    loading,
    submitting,
    deletingTaskId,
    showModal,
    editingTask,
    error,
    formData,
    handleSubmit,
    handleEdit,
    handleDelete,
    openCreateModal,
    closeModal,
    updateFormData,
    getStatusColor,
    getPriorityColor,
  } = useTasks();

  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">Manage your tasks</p>
        </div>
        <Button
          onClick={openCreateModal}
          disabled={submitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSubmitting={submitting}
        deletingTaskId={deletingTaskId}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />

      <TaskModal
        isOpen={showModal}
        editingTask={editingTask}
        formData={formData}
        users={users}
        error={error}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onClose={closeModal}
        onFormDataChange={updateFormData}
      />
    </div>
  );
} 