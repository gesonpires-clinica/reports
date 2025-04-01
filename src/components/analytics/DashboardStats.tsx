"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';

interface Stats {
  totals: {
    totalAppointments: number;
    completedAppointments: number;
    canceledAppointments: number;
    newPatients: number;
    reportsGenerated: number;
  };
  averages: {
    appointmentsPerDay: number;
    completionRate: number;
    cancellationRate: number;
  };
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/analytics?range=${range}`);
        if (!response.ok) throw new Error('Falha ao carregar estatísticas');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [range]);

  if (loading) {
    return <div>Carregando estatísticas...</div>;
  }

  if (!stats) {
    return <div>Nenhuma estatística disponível</div>;
  }

  const statCards = [
    {
      title: 'Total de Atendimentos',
      value: stats.totals.totalAppointments,
      icon: Calendar,
      change: `${stats.averages.appointmentsPerDay.toFixed(1)} por dia`,
    },
    {
      title: 'Novos Pacientes',
      value: stats.totals.newPatients,
      icon: Users,
      change: 'no período',
    },
    {
      title: 'Relatórios Gerados',
      value: stats.totals.reportsGenerated,
      icon: FileText,
      change: 'no período',
    },
    {
      title: 'Taxa de Conclusão',
      value: `${stats.averages.completionRate.toFixed(1)}%`,
      icon: TrendingUp,
      change: `${stats.averages.cancellationRate.toFixed(1)}% cancelamentos`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Estatísticas</h2>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Últimas 24 horas</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
              </div>
              <div className="mt-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 