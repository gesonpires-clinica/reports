'use client';

import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { Toaster } from 'sonner';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Início
              </Link>
              <Link href="/reports" className="text-sm font-medium transition-colors hover:text-primary">
                Relatórios
              </Link>
              <Link href="/templates" className="text-sm font-medium transition-colors hover:text-primary">
                Templates
              </Link>
              <Link href="/common-phrases" className="text-sm font-medium transition-colors hover:text-primary">
                Frases Comuns
              </Link>
              <Link href="/admin/security" className="text-sm font-medium transition-colors hover:text-primary">
                Segurança
              </Link>
            </nav>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </SessionProvider>
  );
} 