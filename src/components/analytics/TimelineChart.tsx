"use client";

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TimelineChartProps {
  type: 'appointments' | 'reports';
  className?: string;
}

interface ChartDataPoint {
  date: string;
  value: number;
}

export function TimelineChart({ type, className }: TimelineChartProps) {
  const [data, setData] = useState<ChartData<'line'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics?range=30d');
        if (!response.ok) throw new Error('Falha ao carregar dados');
        const result = await response.json();

        // Processar dados para o gráfico
        const chartData: ChartDataPoint[] = result.dailyMetrics.map((metric: any) => ({
          date: new Date(metric.date).toLocaleDateString('pt-BR'),
          value: type === 'appointments' ? metric.totalAppointments : metric.reportsGenerated,
        }));

        setData({
          labels: chartData.map(d => d.date),
          datasets: [
            {
              label: type === 'appointments' ? 'Atendimentos' : 'Relatórios',
              data: chartData.map(d => d.value),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.4,
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao carregar dados do gráfico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading) {
    return <div>Carregando gráfico...</div>;
  }

  if (!data) {
    return <div>Nenhum dado disponível</div>;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: type === 'appointments' ? 'Atendimentos por Dia' : 'Relatórios Gerados por Dia',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className={className}>
      <Line data={data} options={options} />
    </div>
  );
} 