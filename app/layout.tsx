import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import { getServerSession } from "next-auth";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import QueryProvider from "@/components/QueryProvider";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export const metadata: Metadata = {
  title: "MFK Stash and Lending Corp",
  description: "A simple loan management system built with Next.js and Prisma",
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <QueryProvider>
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html> 
  );
}
