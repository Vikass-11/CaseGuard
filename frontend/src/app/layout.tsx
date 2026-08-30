import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CaseGuard - Domestic Violence Case Analyzer',
  description: 'Privacy-first case management and decision-support platform',
};

import Providers from '@/components/Providers';
import ForcePasswordChangeModal from '@/components/ForcePasswordChangeModal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary`}>
        <Providers>
          {children}
          <ForcePasswordChangeModal />
        </Providers>
      </body>
    </html>
  );
}
