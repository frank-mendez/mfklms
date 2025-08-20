'use client';

import { useEffect, useState } from 'react';

interface Borrower {
  id: number;
  name: string;
  contactInfo: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function BorrowersPage() {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const response = await fetch('/api/borrowers');
        if (!response.ok) throw new Error('Failed to fetch borrowers');
        const data = await response.json();
        setBorrowers(data);
      } catch (error) {
        console.error('Error fetching borrowers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Borrowers</h1>
        <button className="btn btn-primary">Add Borrower</button>
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
                <th>Name</th>
                <th>Contact Info</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowers.map((borrower) => (
                <tr key={borrower.id}>
                  <td>{borrower.id}</td>
                  <td>{borrower.name}</td>
                  <td>{borrower.contactInfo || '-'}</td>
                  <td>{new Date(borrower.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info">View</button>
                    <button className="btn btn-sm btn-warning">Edit</button>
                    <button className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
              {borrowers.length === 0 && (
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
