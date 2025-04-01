'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/setup');
      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(data.message);
      router.push('/login');
    } catch (error) {
      console.error('Erro na configuração:', error);
      toast.error('Erro ao configurar o sistema');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Configuração Inicial</h1>
        
        <div className="space-y-6">
          <p className="text-gray-600 text-center">
            Esta página irá criar um usuário administrador com as seguintes credenciais:
          </p>
          
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Senha:</strong> admin123</p>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Lembre-se de alterar estas credenciais após o primeiro login.
          </p>

          <Button
            onClick={handleSetup}
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Configurando...' : 'Criar Usuário Admin'}
          </Button>
        </div>
      </Card>
    </div>
  );
} 