import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaseGuard - Domestic Violence Case Analyzer',
  description: 'Privacy-first case management and decision-support platform',
};

import Providers from '@/components/Providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0f1014] text-slate-200 antialiased selection:bg-white/10 selection:text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
