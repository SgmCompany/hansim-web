'use client';

import { WorkProfileOnboarding } from '@/src/components/WorkProfileOnboarding';
import { Navigation } from '@/src/components/Navigation';
import { Footer } from '@/src/components/Footer';

export default function WorkProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navigation />

      <main className="flex-grow w-full max-w-[42.5rem] mx-auto px-4 sm:px-6 lg:px-8 pt-[calc(4.5rem+env(safe-area-inset-top,0px))] sm:pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
        <WorkProfileOnboarding />
      </main>

      <Footer />
    </div>
  );
}
