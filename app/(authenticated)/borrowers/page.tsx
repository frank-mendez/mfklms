'use client';
import { useState } from 'react';
import { useBorrowers } from '@/react-query/borrowers';
import { Borrower } from '@/types/borrower';
import { CreateEditBorrowerModal, DeleteBorrowerModal, ViewBorrowerModal } from '@/components/borrowers';
import { PlusIcon, EyeIcon, EditIcon, DeleteIcon, ErrorIcon, LoadingSpinner, UsersIcon } from '@/assets/icons';

export default function BorrowersPage() {
  const { data: borrowers, isLoading, error } = useBorrowers();
  
  // Modal state
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [deletingBorrower, setDeletingBorrower] = useState<Borrower | null>(null);
  const [viewingBorrower, setViewingBorrower] = useState<Borrower | null>(null);

  const handleOpenCreateModal = () => {
    setEditingBorrower(null);
    setIsCreateEditModalOpen(true);
  };

  const handleOpenEditModal = (borrower: Borrower) => {
    setEditingBorrower(borrower);
    setIsCreateEditModalOpen(true);
  };

  const handleCloseCreateEditModal = () => {
    setIsCreateEditModalOpen(false);
    setEditingBorrower(null);
  };

  const handleDelete = (borrower: Borrower) => {
    setDeletingBorrower(borrower);
  };

  const handleCloseDeleteModal = () => {
    setDeletingBorrower(null);
  };

  const handleView = (borrower: Borrower) => {
    setViewingBorrower(borrower);
  };

  const handleCloseViewModal = () => {
    setViewingBorrower(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Borrowers</h1>
        <button 
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Borrower
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner className="loading loading-spinner loading-lg" />
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <ErrorIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>Error loading borrowers. Please try again later.</span>
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
              {borrowers?.map((borrower) => (
                <tr key={borrower.id}>
                  <td>{borrower.id}</td>
                  <td className="font-medium">{borrower.name}</td>
                  <td>{borrower.contactInfo || '-'}</td>
                  <td>{new Date(borrower.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleView(borrower)}
                    >
                      <EyeIcon />
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleOpenEditModal(borrower)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(borrower)}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!borrowers || borrowers.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="text-gray-500">
                      <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">No borrowers found</p>
                      <p className="text-sm">Start by adding your first borrower</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateEditBorrowerModal
        isOpen={isCreateEditModalOpen}
        onClose={handleCloseCreateEditModal}
        editingBorrower={editingBorrower}
      />
      
      <ViewBorrowerModal
        borrower={viewingBorrower}
        onClose={handleCloseViewModal}
        onEdit={handleOpenEditModal}
      />
      
      <DeleteBorrowerModal
        borrower={deletingBorrower}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
}
