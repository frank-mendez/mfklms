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
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content grid place-items-center">
              {session?.user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
            <li className="menu-title px-4 py-2">
              <span className="text-sm font-semibold">{session?.user?.email}</span>
            </li>
            <li><a onClick={() => signOut()}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
