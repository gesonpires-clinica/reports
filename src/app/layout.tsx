import "@/styles/globals.css";
import Header from "@/components/Header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

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
        <main className="p-6">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
