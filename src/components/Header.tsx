"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-2">
         {/* Logo: a imagem deve estar na pasta public, por exemplo, /public/logo.png */}
         <Image
          src="/logo-mb.png"
          alt="Logo GeraRAN"
          width={40} // ajuste a largura conforme necessário
          height={40} // ajuste a altura conforme necessário
        />
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
