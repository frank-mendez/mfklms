import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { logLogin } from "@/lib/activity-logger";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Log successful login
        await logLogin(user.id, user.email);

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial login or when user object is available
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      }
      
      // On subsequent requests or token refresh, ensure we have fresh user data
      if (token.id && (!token.role || trigger === 'update')) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, role: true, status: true, firstName: true, lastName: true }
          });
          
          if (dbUser) {
            token.role = dbUser.role;
            token.status = dbUser.status;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
          }
        } catch (error) {
          console.error('Error fetching user data for token:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role,
          firstName: token.firstName as string | null,
          lastName: token.lastName as string | null,
        }
      };
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };