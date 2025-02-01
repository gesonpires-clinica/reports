"use client";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="bg-red-500 text-white p-10 text-center text-2xl">ShadCN funcionando! 🎉</h1>
        <Button variant="default" className="px-6 py-2">
          Testar Botão
        </Button>
      </div>
    </main>
  );
}
