"use client";

import "@/styles/globals.css";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-100">
        <Header />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
