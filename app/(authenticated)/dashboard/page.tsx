'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'access-denied') {
      setShowAccessDenied(true);
      // Auto-hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowAccessDenied(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {showAccessDenied && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Access Denied</h3>
            <div className="text-xs">You don't have permission to access that page. Contact your administrator if you believe this is an error.</div>
          </div>
          <button 
            className="btn btn-sm btn-ghost"
            onClick={() => setShowAccessDenied(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Your dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Welcome!</h2>
            <p>This is your dashboard. Content will vary based on your role and permissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
