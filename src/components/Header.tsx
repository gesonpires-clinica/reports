"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
      <div className="text-xl font-bold">
        <Link href="/">Minha Aplicação</Link>
      </div>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/editor">Criar Relatório</Link>
      </nav>
    </header>
  );
}
