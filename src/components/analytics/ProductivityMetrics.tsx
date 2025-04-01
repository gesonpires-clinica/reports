"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProductivityData {
  userId: string;
  name: string;
  totalAppointments: number;
  reportsGenerated: number;
  averageReportTime: number;
  patientSatisfaction: number;
}

export function ProductivityMetrics() {
  const [productivityData, setProductivityData] = useState<ProductivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/productivity-metrics');
        if (!response.ok) throw new Error('Falha ao carregar dados de produtividade');
        const data = await response.json();
        setProductivityData(data);
      } catch (error) {
        console.error('Erro ao carregar dados de produtividade:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivityData();
  }, []);

  if (loading) {
    return <div>Carregando métricas de produtividade...</div>;
  }

  if (productivityData.length === 0) {
    return <div>Nenhuma métrica de produtividade disponível</div>;
  }

  return (
    <div className="space-y-4">
      {productivityData.map((user) => (
        <Card key={user.userId} className="p-4">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm">Atendimentos Totais</p>
                <p className="text-xl font-bold">{user.totalAppointments}</p>
              </div>
              <div>
                <p className="text-sm">Relatórios Gerados</p>
                <p className="text-xl font-bold">{user.reportsGenerated}</p>
              </div>
              <div>
                <p className="text-sm">Tempo Médio de Relatório</p>
                <p className="text-xl font-bold">{user.averageReportTime} min</p>
              </div>
              <div>
                <p className="text-sm">Satisfação do Paciente</p>
                <Progress value={user.patientSatisfaction} max={5} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 