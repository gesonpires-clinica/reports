"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-200 p-4 hidden md:block">
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="block p-2 hover:bg-gray-300 rounded">
            Painel
          </Link>
        </li>
        <li>
          <Link href="/editor" className="block p-2 hover:bg-gray-300 rounded">
            Criar Relatório
          </Link>
        </li>
        {/* Adicione outros links conforme necessário */}
      </ul>
    </aside>
  );
}
