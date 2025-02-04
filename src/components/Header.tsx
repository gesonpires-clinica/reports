"use client";

import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo e Título */}
        <div className="flex items-center space-x-2">
          <Image
            src="/logo-mb.png"  // Certifique-se de que a imagem está em /public/logo-mb.png
            alt="Logo GeraRAN"
            width={40}
            height={40}
            className="rounded"
          />
          <Link
            href="/"
            className="text-xl font-bold transition-colors duration-200 hover:text-gray-300"
          >
            GeraRAN
          </Link>
        </div>

        {/* Menu de Navegação usando NavigationMenu */}
        <NavigationMenu className="mt-4 md:mt-0">
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="transition-colors duration-200 hover:text-gray-300"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/dashboard"
                  className="transition-colors duration-200 hover:text-gray-300"
                >
                  Painel
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/editor"
                  className="transition-colors duration-200 hover:text-gray-300"
                >
                  Criar relatório
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
