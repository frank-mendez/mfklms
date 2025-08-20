'use client';

import { useEffect, useState } from 'react';

interface Owner {
  id: number;
  name: string;
  contactInfo: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch('/api/owners');
        if (!response.ok) throw new Error('Failed to fetch owners');
        const data = await response.json();
        setOwners(data);
      } catch (error) {
        console.error('Error fetching owners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Stash Owners</h1>
        <button className="btn btn-primary">Add Owner</button>
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
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td>{owner.id}</td>
                  <td>{owner.name}</td>
                  <td>{owner.contactInfo || '-'}</td>
                  <td>{new Date(owner.createdAt).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button className="btn btn-sm btn-info">View</button>
                    <button className="btn btn-sm btn-warning">Edit</button>
                    <button className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
              {owners.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No owners found
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
