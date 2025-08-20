'use client';
import { useState } from 'react';
import { useLoans } from '@/react-query/loans';
import { Loan } from '@/types/loan';
import { CreateEditLoanModal, DeleteLoanModal, ViewLoanModal } from '@/components/loans';
import { PlusIcon, EyeIcon, EditIcon, DeleteIcon, ErrorIcon, LoadingSpinner, MoneyIcon } from '@/assets/icons';

export default function LoansPage() {
  const { data: loans, isLoading, error } = useLoans();
  
  // Modal state
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [deletingLoan, setDeletingLoan] = useState<Loan | null>(null);
  const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);

  const handleOpenCreateModal = () => {
    setEditingLoan(null);
    setIsCreateEditModalOpen(true);
  };

  const handleOpenEditModal = (loan: Loan) => {
    setEditingLoan(loan);
    setIsCreateEditModalOpen(true);
  };

  const handleCloseCreateEditModal = () => {
    setIsCreateEditModalOpen(false);
    setEditingLoan(null);
  };

  const handleDelete = (loan: Loan) => {
    setDeletingLoan(loan);
  };

  const handleCloseDeleteModal = () => {
    setDeletingLoan(null);
  };

  const handleView = (loan: Loan) => {
    setViewingLoan(loan);
  };

  const handleCloseViewModal = () => {
    setViewingLoan(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'badge badge-success';
      case 'CLOSED':
        return 'badge badge-neutral';
      case 'DEFAULTED':
        return 'badge badge-error';
      default:
        return 'badge';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Loans</h1>
        <button 
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Loan
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <LoadingSpinner className="loading loading-spinner loading-lg" />
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <ErrorIcon className="stroke-current shrink-0 h-6 w-6" />
          <span>Error loading loans. Please try again later.</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-200 rounded-lg">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID</th>
                <th>Borrower</th>
                <th>Principal</th>
                <th>Interest Rate</th>
                <th>Start Date</th>
                <th>Maturity Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans?.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.id}</td>
                  <td>{loan.borrower.name}</td>
                  <td>{formatCurrency(loan.principal)}</td>
                  <td>{loan.interestRate}%</td>
                  <td>{new Date(loan.startDate).toLocaleDateString()}</td>
                  <td>
                    {loan.maturityDate
                      ? new Date(loan.maturityDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(loan.status)}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="space-x-2">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => handleView(loan)}
                    >
                      <EyeIcon />
                      View
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleOpenEditModal(loan)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(loan)}
                    >
                      <DeleteIcon />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!loans || loans.length === 0) && (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">
                      <MoneyIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">No loans found</p>
                      <p className="text-sm">Start by creating your first loan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CreateEditLoanModal
        isOpen={isCreateEditModalOpen}
        onClose={handleCloseCreateEditModal}
        editingLoan={editingLoan}
      />
      
      <ViewLoanModal
        loan={viewingLoan}
        onClose={handleCloseViewModal}
        onEdit={handleOpenEditModal}
      />
      
      <DeleteLoanModal
        loan={deletingLoan}
        onClose={handleCloseDeleteModal}
      />
    </div>
  );
}
