'use client';

import { useBorrowers, useDeleteBorrower } from '@/react-query/borrowers';
import { useState } from 'react';

export default function BorrowersPage() {
  const { data: borrowers, isLoading, error } = useBorrowers();
  const deleteBorrower = useDeleteBorrower();
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this borrower?')) {
      try {
        await deleteBorrower.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting borrower:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Borrowers</h1>
        <button className="btn btn-primary">Add Borrower</button>
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
                  <td>{borrower.name}</td>
                  <td>{borrower.contactInfo || '-'}</td>
                  <td>{new Date(borrower.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info">View</button>
                    <button className="btn btn-sm btn-warning">Edit</button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(borrower.id)}
                      disabled={deleteBorrower.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!borrowers || borrowers.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No borrowers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
