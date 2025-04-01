import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats } from '@/components/analytics/DashboardStats';
import { PatientProgress } from '@/components/analytics/PatientProgress';
import { ProductivityMetrics } from '@/components/analytics/ProductivityMetrics';
import { TimelineChart } from '@/components/analytics/TimelineChart';

export const metadata: Metadata = {
  title: 'Analytics | Sistema de Relatórios',
  description: 'Dashboard de análises e estatísticas',
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Análises e estatísticas do sistema
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="patients">Evolução de Pacientes</TabsTrigger>
          <TabsTrigger value="productivity">Produtividade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <DashboardStats />
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Atendimentos por Período
              </h3>
              <TimelineChart
                type="appointments"
                className="h-[300px]"
              />
            </Card>
            
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Relatórios Gerados
              </h3>
              <TimelineChart
                type="reports"
                className="h-[300px]"
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card className="p-4">
            <PatientProgress />
          </Card>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <Card className="p-4">
            <ProductivityMetrics />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 