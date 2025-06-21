import { Plus } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { LoadingSpinner, UserList, UserModal, Button } from '../components';

export default function Users() {
  const {
    users,
    loading,
    submitting,
    deletingUserId,
    showModal,
    editingUser,
    error,
    formData,
    handleSubmit,
    handleEdit,
    handleDelete,
    openCreateModal,
    closeModal,
    updateFormData,
  } = useUsers();

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600">Manage your users</p>
        </div>
        <Button
          onClick={openCreateModal}
          disabled={submitting}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isSubmitting={submitting}
        deletingUserId={deletingUserId}
      />

      <UserModal
        isOpen={showModal}
        editingUser={editingUser}
        formData={formData}
        error={error}
        isSubmitting={submitting}
        onSubmit={handleSubmit}
        onClose={closeModal}
        onFormDataChange={updateFormData}
      />
    </div>
  );
} 