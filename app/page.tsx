'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeatureGrid } from '@/components/FeatureGrid';
import { ComplaintForm } from '@/components/ComplaintForm';
import { AuthModal } from '@/components/AuthModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      <Hero onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      <FeatureGrid />
      <ComplaintForm />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}