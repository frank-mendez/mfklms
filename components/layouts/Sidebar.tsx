'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Borrowers', href: '/borrowers', icon: '👥' },
  { name: 'Loans', href: '/loans', icon: '💰' },
  { name: 'Repayments', href: '/repayments', icon: '💸' },
  { name: 'Transactions', href: '/transactions', icon: '📝' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <aside className="menu w-64 min-h-full bg-base-200 text-base-content pt-4 px-4">
        <div className="mb-8 px-4">
          <h2 className="text-lg font-bold">Menu</h2>
        </div>
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-300 transition-colors ${
                    isActive ? 'bg-primary text-primary-content hover:bg-primary' : ''
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
