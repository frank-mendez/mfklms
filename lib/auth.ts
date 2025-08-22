
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

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
