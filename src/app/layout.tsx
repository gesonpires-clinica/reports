import "@/styles/globals.css";
import Header from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeraRan - Gerador de Relatórios",
  description: "Sistema para geração de relatórios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Header />
        <main className="p-6">
          <nav className="flex gap-4">
            <Link href="/reports" className="hover:text-gray-300">
              Relatórios
            </Link>
            <Link href="/templates" className="hover:text-gray-300">
              Templates
            </Link>
            <Link href="/common-phrases" className="hover:text-gray-300">
              Frases Comuns
            </Link>
          </nav>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
