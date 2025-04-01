'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Settings, Trash2 } from 'lucide-react';

interface Integration {
  _id: string;
  name: string;
  type: string;
  provider: string;
  status: string;
  lastSync?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'scheduling',
    provider: '',
    config: {},
    credentials: {},
  });

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations');
      if (!response.ok) throw new Error('Erro ao carregar integrações');
      const data = await response.json();
      setIntegrations(data);
    } catch (error) {
      console.error('Erro ao carregar integrações:', error);
      toast.error('Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao criar integração');
      
      toast.success('Integração criada com sucesso');
      setShowForm(false);
      setFormData({
        name: '',
        type: 'scheduling',
        provider: '',
        config: {},
        credentials: {},
      });
      fetchIntegrations();
    } catch (error) {
      console.error('Erro ao criar integração:', error);
      toast.error('Erro ao criar integração');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta integração?')) return;

    try {
      const response = await fetch(`/api/integrations?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir integração');
      
      toast.success('Integração excluída com sucesso');
      fetchIntegrations();
    } catch (error) {
      console.error('Erro ao excluir integração:', error);
      toast.error('Erro ao excluir integração');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Integrações</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Integração
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium">Nova Integração</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                <option value="scheduling">Agendamento</option>
                <option value="clinic">Gestão de Clínica</option>
                <option value="payment">Pagamento</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Provedor
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) =>
                  setFormData({ ...formData, provider: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Criar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-sm text-slate-500">Carregando...</div>
      ) : integrations.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <h3 className="text-sm font-medium text-slate-900">
            Nenhuma integração configurada
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Comece adicionando uma nova integração para conectar seus sistemas.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <div
              key={integration._id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">
                    {integration.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {integration.provider}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      // TODO: Implementar edição
                    }}
                    className="rounded p-1 hover:bg-slate-100"
                  >
                    <Settings className="h-4 w-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(integration._id)}
                    className="rounded p-1 hover:bg-slate-100"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    integration.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : integration.status === 'error'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {integration.status === 'active'
                    ? 'Ativo'
                    : integration.status === 'error'
                    ? 'Erro'
                    : 'Inativo'}
                </span>
                {integration.lastSync && (
                  <span className="text-xs text-slate-500">
                    Última sincronização:{' '}
                    {new Date(integration.lastSync).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 