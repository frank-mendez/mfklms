'use client';

import { useSession } from "next-auth/react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useSession();

  return (
    <div className="min-h-screen bg-base-100">
      <Header />

      {/* Drawer and Main Content */}
      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        
        {/* Main Content */}
        <div className="drawer-content">
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
