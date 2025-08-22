'use client';

import { useSession } from 'next-auth/react';

export default function SessionDebug() {
  const { data: session, status } = useSession();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-2 text-xs rounded shadow-lg z-50 max-w-xs">
      <div><strong>Status:</strong> {status}</div>
      <div><strong>User ID:</strong> {session?.user?.id || 'undefined'}</div>
      <div><strong>Role:</strong> {session?.user?.role || 'undefined'}</div>
      <div><strong>Email:</strong> {session?.user?.email || 'undefined'}</div>
    </div>
  );
}
