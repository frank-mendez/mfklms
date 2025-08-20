'use client';

import { useStashes, useDeleteStash } from '@/react-query/stashes';

export default function StashesPage() {
  const { data: stashes, isLoading, error } = useStashes();
  const deleteStash = useDeleteStash();

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this stash contribution?')) {
      try {
        await deleteStash.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting stash:', error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatMonth = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stash Contributions</h1>
        <button className="btn btn-primary">Add Contribution</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                  <td>{stash.owner.name}</td>
                  <td>{formatMonth(stash.month)}</td>
                  <td>{formatCurrency(stash.amount)}</td>
                  <td>{stash.remarks || '-'}</td>
                  <td>{new Date(stash.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info">View</button>
                    <button className="btn btn-sm btn-warning">Edit</button>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(stash.id)}
                      disabled={deleteStash.isPending}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(!stashes || stashes.length === 0) && (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No contributions found
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
