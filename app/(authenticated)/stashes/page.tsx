'use client';

import { useState } from 'react';
import { useStashes } from '@/react-query/stashes';
import { Stash } from '@/types/stash';
import { CreateEditStashModal, ViewStashModal, DeleteStashModal } from '@/components/stashes';
import { ErrorModal } from '@/components/common';
import { PlusIcon, EyeIcon, EditIcon, DeleteIcon, ErrorIcon, LoadingSpinner, MoneyIcon } from '@/assets/icons';
import { useErrorModal } from '@/hooks';

export default function StashesPage() {
  const { data: stashes, isLoading, error } = useStashes();
  const { errorModal, showError, hideError } = useErrorModal();
  
  // Modal state
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingStash, setEditingStash] = useState<Stash | null>(null);
  const [deletingStash, setDeletingStash] = useState<Stash | null>(null);
  const [viewingStash, setViewingStash] = useState<Stash | null>(null);

  const handleOpenCreateModal = () => {
    setEditingStash(null);
    setIsCreateEditModalOpen(true);
  };

  const handleOpenEditModal = (stash: Stash) => {
    setEditingStash(stash);
    setIsCreateEditModalOpen(true);
  };

  const handleCloseCreateEditModal = () => {
    setIsCreateEditModalOpen(false);
    setEditingStash(null);
  };

  const handleDelete = (stash: Stash) => {
    setDeletingStash(stash);
  };

  const handleCloseDeleteModal = () => {
    setDeletingStash(null);
  };

  const handleView = (stash: Stash) => {
    setViewingStash(stash);
  };

  const handleCloseViewModal = () => {
    setViewingStash(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatMonth = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stash Contributions</h1>
        <button 
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Contribution
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner className="loading loading-spinner loading-lg" />
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <ErrorIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>Error loading stash contributions. Please try again later.</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Owner</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Remarks</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stashes?.map((stash) => (
                <tr key={stash.id}>
                  <td>{stash.id}</td>
                  <td className="font-medium">{stash.owner.name}</td>
                  <td>{formatMonth(stash.month)}</td>
                  <td className="font-bold text-success">{formatCurrency(stash.amount)}</td>
                  <td>
                    {stash.remarks ? (
                      <span className="text-sm">{stash.remarks}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td>{new Date(stash.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleView(stash)}
                    >
                      <EyeIcon />
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleOpenEditModal(stash)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(stash)}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!stashes || stashes.length === 0) && (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <div className="text-gray-500">
                      <MoneyIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">No stash contributions found</p>
                      <p className="text-sm">Start by adding your first contribution</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateEditStashModal
        isOpen={isCreateEditModalOpen}
        onClose={handleCloseCreateEditModal}
        editingStash={editingStash}
        onError={showError}
      />
      
      <ViewStashModal
        stash={viewingStash}
        onClose={handleCloseViewModal}
        onEdit={handleOpenEditModal}
      />
      
      <DeleteStashModal
        stash={deletingStash}
        onClose={handleCloseDeleteModal}
        onError={showError}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={hideError}
        title={errorModal.title}
        message={errorModal.message}
      />
    </div>
  );
}
