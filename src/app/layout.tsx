'use client'

import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { UserNav } from '@/components/UserNav'
import { NotificationBell } from '@/components/NotificationBell'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <SessionProvider>
          <div className="min-h-screen bg-slate-50">
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <nav className="flex items-center space-x-6">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-slate-900">
                      Início
                    </Link>
                    <Link href="/reports" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                      Relatórios
                    </Link>
                    <Link href="/templates" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                      Templates
                    </Link>
                    <Link href="/common-phrases" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                      Frases Comuns
                    </Link>
                    <Link href="/admin/security" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                      Segurança
                    </Link>
                    <Link href="/admin/integrations" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
                      Integrações
                    </Link>
                  </nav>
                  <div className="flex items-center space-x-4">
                    <NotificationBell />
                    <UserNav />
                  </div>
                </div>
              </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
