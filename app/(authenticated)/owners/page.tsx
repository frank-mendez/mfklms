'use client';

import { useState } from 'react';
import { useOwners } from '@/react-query/owners';
import { Owner } from '@/types/owner';
import { CreateEditOwnerModal, ViewOwnerModal, DeleteOwnerModal } from '@/components/owners';
import { PlusIcon, EyeIcon, EditIcon, DeleteIcon, ErrorIcon, LoadingSpinner, UsersIcon } from '@/assets/icons';

export default function OwnersPage() {
  const { data: owners, isLoading, error } = useOwners();
  
  // Modal state
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<Owner | null>(null);
  const [deletingOwner, setDeletingOwner] = useState<Owner | null>(null);
  const [viewingOwner, setViewingOwner] = useState<Owner | null>(null);

  const handleOpenCreateModal = () => {
    setEditingOwner(null);
    setIsCreateEditModalOpen(true);
  };

  const handleOpenEditModal = (owner: Owner) => {
    setEditingOwner(owner);
    setIsCreateEditModalOpen(true);
  };

  const handleCloseCreateEditModal = () => {
    setIsCreateEditModalOpen(false);
    setEditingOwner(null);
  };

  const handleDelete = (owner: Owner) => {
    setDeletingOwner(owner);
  };

  const handleCloseDeleteModal = () => {
    setDeletingOwner(null);
  };

  const handleView = (owner: Owner) => {
    setViewingOwner(owner);
  };

  const handleCloseViewModal = () => {
    setViewingOwner(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Owners</h1>
        <button 
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Owner
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner className="loading loading-spinner loading-lg" />
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <ErrorIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>Error loading owners. Please try again later.</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact Info</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners?.map((owner) => (
                <tr key={owner.id}>
                  <td>{owner.id}</td>
                  <td className="font-medium">{owner.name}</td>
                  <td>{owner.contactInfo || '-'}</td>
                  <td>{new Date(owner.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleView(owner)}
                    >
                      <EyeIcon />
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleOpenEditModal(owner)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(owner)}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!owners || owners.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="text-gray-500">
                      <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">No owners found</p>
                      <p className="text-sm">Start by adding your first owner</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateEditOwnerModal
        isOpen={isCreateEditModalOpen}
        onClose={handleCloseCreateEditModal}
        editingOwner={editingOwner}
      />
      
      <ViewOwnerModal
        owner={viewingOwner}
        onClose={handleCloseViewModal}
        onEdit={handleOpenEditModal}
      />
      
      <DeleteOwnerModal
        owner={deletingOwner}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
}
