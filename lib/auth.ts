// filepath: c:\Users\frank\Projects\mfklms\lib\auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]";
import { UserRole } from "@prisma/client/wasm";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const isAdmin = async () => {
  const user = await getCurrentUser();
  return user?.role === UserRole.ADMIN;
};