'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface NavSection {
  name: string;
  items: NavItem[];
}

type NavElement = NavItem | NavSection;

const navigation: NavElement[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { 
    name: 'Lending',
    items: [
      { name: 'Borrowers', href: '/borrowers', icon: '👥' },
      { name: 'Loans', href: '/loans', icon: '💰' },
      { name: 'Repayments', href: '/repayments', icon: '💸' },
      { name: 'Transactions', href: '/transactions', icon: '📝' },
    ]
  },
  {
    name: 'Stash',
    items: [
      { name: 'Owners', href: '/owners', icon: '👤' },
      { name: 'Contributions', href: '/stashes', icon: '💹' },
    ]
  },
  {
    name: 'Management',
    items: [
      { name: 'Users', href: '/users', icon: '👨‍💼' },
      { name: 'Activity Logs', href: '/activities', icon: '📋' },
    ]
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <aside className="menu w-64 min-h-full bg-base-200 text-base-content pt-4 px-4">
        <ul className="space-y-4">
          {navigation.map((section) => {
            if ('items' in section) {
              // Section with sub-items
              return (
                <li key={section.name} className="menu-section">
                  <h3 className="menu-title px-4 mb-2 text-sm font-semibold text-base-content/60">
                    {section.name}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
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
                </li>
              );
            } else {
              // Single item
              const isActive = pathname === section.href;
              return (
                <li key={section.name}>
                  <Link
                    href={section.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-base-300 transition-colors ${
                      isActive ? 'bg-primary text-primary-content hover:bg-primary' : ''
                    }`}
                  >
                    <span>{section.icon}</span>
                    {section.name}
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </aside>
    </div>
  );
}
