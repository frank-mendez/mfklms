'use client';
import { useState } from 'react';
import { useBorrowers } from '@/react-query/borrowers';
import { Borrower } from '@/types/borrower';
import { CreateEditBorrowerModal, DeleteBorrowerModal, ViewBorrowerModal } from '@/components/borrowers';

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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Borrower
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleOpenEditModal(borrower)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(borrower)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!borrowers || borrowers.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
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
