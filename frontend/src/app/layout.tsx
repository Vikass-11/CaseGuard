import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CaseGuard - Domestic Violence Case Analyzer & Legal Advocacy Suite',
  description: 'Privacy-first forensic case management, clinical lethality analysis, and decision-support platform for legal-aid advocates and attorneys.',
};

import Providers from '@/components/Providers';
import ForcePasswordChangeModal from '@/components/ForcePasswordChangeModal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/10 selection:text-primary font-sans">
        <Providers>
          {children}
          <ForcePasswordChangeModal />
        </Providers>
      </body>
    </html>
  );
}
