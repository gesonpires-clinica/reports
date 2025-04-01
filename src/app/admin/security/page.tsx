'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Log {
  _id: string;
  userId: string;
  action: string;
  ip: string;
  userAgent: string;
  timestamp: string;
}

interface Backup {
  _id: string;
  filename: string;
  size: number;
  createdAt: string;
}

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState<Log[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      if (activeTab === 'logs') {
        const response = await fetch('/api/logs');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setLogs(data.logs || []);
      } else {
        const response = await fetch('/api/backup');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setBackups(data.backups || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
      toast.error('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const response = await fetch('/api/backup', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      toast.success('Backup criado com sucesso');
      fetchData();
    } catch (err) {
      toast.error('Erro ao criar backup');
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/backup/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ backupId })
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      toast.success('Backup restaurado com sucesso');
    } catch (err) {
      toast.error('Erro ao restaurar backup');
    }
  };

  const handleClearLogs = async () => {
    try {
      const response = await fetch('/api/logs', {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      toast.success('Logs limpos com sucesso');
      setLogs([]);
    } catch (err) {
      toast.error('Erro ao limpar logs');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Segurança e Backup</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="logs">Logs de Acesso</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Logs de Acesso</h2>
              <Button onClick={handleClearLogs} variant="outline">
                Limpar Logs
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Carregando logs...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8">Nenhum log encontrado</div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log._id}
                    className="p-4 border rounded-lg"
                  >
                    <p><strong>Ação:</strong> {log.action}</p>
                    <p><strong>Usuário:</strong> {log.userId}</p>
                    <p><strong>IP:</strong> {log.ip}</p>
                    <p><strong>User Agent:</strong> {log.userAgent}</p>
                    <p><strong>Data:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="backups">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Backups</h2>
              <Button onClick={handleCreateBackup}>
                Criar Backup
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Carregando backups...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8">Nenhum backup encontrado</div>
            ) : (
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div
                    key={backup._id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p><strong>Nome:</strong> {backup.filename}</p>
                      <p><strong>Tamanho:</strong> {(backup.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p><strong>Data:</strong> {new Date(backup.createdAt).toLocaleString()}</p>
                    </div>
                    <Button
                      onClick={() => handleRestoreBackup(backup._id)}
                      variant="outline"
                    >
                      Restaurar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 