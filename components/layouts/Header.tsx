'use client';

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <div className="navbar bg-base-200 shadow-lg px-4">
      <div className="flex-1">
        <label htmlFor="my-drawer" className="btn btn-ghost lg:hidden">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
        <Link href="/dashboard" className="text-xl font-bold">MFKLMS</Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
       <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-8 rounded-full">
            <span className="text-xs">{session?.user?.firstName?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'U'}</span>
          </div>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <span className="text-sm font-semibold">
            {session?.user?.firstName ? 
              `${session.user.firstName} ${session.user.lastName || ''}`.trim() : 
              session?.user?.email
            }
          </span>
        </li>
       <li><a onClick={() => signOut()}>Logout</a></li>
      </ul>
    </div>
        </div>
    </div>
  );
}
