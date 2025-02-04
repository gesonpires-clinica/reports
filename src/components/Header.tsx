"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Área do Logo e Título */}
        <Image
          src="/logo-mb.png"
          alt="Logo GeraRAN"
          width={40} // ajuste a largura conforme necessário
          height={40} // ajuste a altura conforme necessário
        />
        <Link
          href="/"
          className="text-xl font-bold transition-colors duration-200 hover:bg-blue-700 px-2 py-1"
          >
          GeraRAN
        </Link>
      </div>
      {/* Navegação */}
      <nav className="mt-4 md:mt-0 w-full flex flex-col md:flex-row md:justify-end space-y-2 md:space-y-0 md:space-x-4">
        <Link
          href="/"
          className="transition-colors duration-200 hover:bg-blue-700 px-2 py-1"
          >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="transition-colors duration-200 hover:bg-blue-700 px-2 py-1"
          >
          Painel
        </Link>
        <Link
          href="/editor"
          className="transition-colors duration-200 hover:bg-blue-700 px-2 py-1"
          >
          Criar Relatório
        </Link>
      </nav>
    </header>
  );
}
