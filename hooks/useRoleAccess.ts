import { useSession } from 'next-auth/react';

export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

export const useRoleAccess = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role as UserRole | undefined;

  const hasRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(userRole);
  };

  const isUser = () => userRole === 'USER';
  const isAdmin = () => userRole === 'ADMIN';
  const isSuperAdmin = () => userRole === 'SUPERADMIN';
  
  const isAdminOrAbove = () => userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const canAccessStash = () => isAdminOrAbove();
  const canAccessManagement = () => isSuperAdmin();

  return {
    userRole,
    hasRole,
    isUser,
    isAdmin,
    isSuperAdmin,
    isAdminOrAbove,
    canAccessStash,
    canAccessManagement,
  };
};
