
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const isUser = async () => {
  const user = await getCurrentUser();
  return user?.role === "USER";
};

export const isAdmin = async () => {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
};

export const isSuperAdmin = async () => {
  const user = await getCurrentUser();
  return user?.role === "SUPERADMIN";
};

// Authorization utility functions for API routes
export const checkAuth = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { authorized: false as const, user: null, response: new NextResponse("Unauthorized", { status: 401 }) };
  }
  return { authorized: true as const, user: currentUser, response: null };
};

export const checkAdminAuth = async () => {
  const currentUser = await getCurrentUser();
  const isUserAdmin = await isAdmin();
  
  if (!currentUser || !isUserAdmin) {
    return { authorized: false as const, user: null, response: new NextResponse("Unauthorized", { status: 403 }) };
  }
  return { authorized: true as const, user: currentUser, response: null };
};

export const checkAdminOrSuperAdminAuth = async () => {
  const currentUser = await getCurrentUser();
  const isUserAdmin = await isAdmin();
  const isUserSuperAdmin = await isSuperAdmin();
  
  if (!currentUser || (!isUserAdmin && !isUserSuperAdmin)) {
    return { authorized: false as const, user: null, response: new NextResponse("Unauthorized", { status: 403 }) };
  }
  return { authorized: true as const, user: currentUser, response: null };
};

export const checkSuperAdminAuth = async () => {
  const currentUser = await getCurrentUser();
  const isUserSuperAdmin = await isSuperAdmin();
  
  if (!currentUser || !isUserSuperAdmin) {
    return { authorized: false as const, user: null, response: new NextResponse("Unauthorized", { status: 403 }) };
  }
  return { authorized: true as const, user: currentUser, response: null };
};
