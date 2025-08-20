'use client';

import { useEffect, useState } from 'react';

interface Stash {
  id: number;
  ownerId: number;
  owner: {
    name: string;
  };
  month: string;
  amount: number;
  remarks: string | null;
  createdAt: string;
}

export default function StashesPage() {
  const [stashes, setStashes] = useState<Stash[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStashes = async () => {
      try {
        const response = await fetch('/api/stashes');
        if (!response.ok) throw new Error('Failed to fetch stashes');
        const data = await response.json();
        setStashes(data);
      } catch (error) {
        console.error('Error fetching stashes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStashes();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatMonth = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
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

      {loading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
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
              {stashes.map((stash) => (
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
                    <button className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
              {stashes.length === 0 && (
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
