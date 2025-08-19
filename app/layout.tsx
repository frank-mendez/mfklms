import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";


export const metadata: Metadata = {
  title: "MFK Stash and Lending Corp",
  description: "A simple loan management system built with Next.js and Prisma",
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
