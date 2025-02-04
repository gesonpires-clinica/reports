"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
      <div className="text-xl font-bold">
        <Link
          href="/"
          className="transition-colors duration-200 hover:to-gray-300 hover:scale-105"
        >
          GeraRAN
        </Link>
      </div>
      <nav className="space-x-4">
        <Link
          href="/"
          className="transition-colors duration-200 hover:text-gray-300 hover:scale-105"
        >
          Home
        </Link>
        <Link href="/dashboard"          className="transition-colors duration-200 hover:text-gray-300 hover:scale-105"
        >Painel</Link>
        <Link href="/editor"           className="transition-colors duration-200 hover:text-gray-300 hover:scale-105"
        >Criar Relatório</Link>
      </nav>
    </header>
  );
}
