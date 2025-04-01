import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Analytics } from '@/models/Analytics';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Função auxiliar para formatar datas
const formatDateRange = (range: string = '7d') => {
  const end = new Date();
  const start = new Date();
  
  switch (range) {
    case '24h':
      start.setHours(start.getHours() - 24);
      break;
    case '7d':
      start.setDate(start.getDate() - 7);
      break;
    case '30d':
      start.setDate(start.getDate() - 30);
      break;
    case '90d':
      start.setDate(start.getDate() - 90);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }

  return { start, end };
};

// GET: Obter estatísticas gerais
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const { start, end } = formatDateRange(range);

    await connectToDatabase();
    const analytics = await Analytics.findOne({});

    if (!analytics) {
      return NextResponse.json({ error: 'Nenhum dado encontrado' }, { status: 404 });
    }

    // Filtrar métricas diárias pelo período
    const dailyMetrics = analytics.dailyMetrics.filter(
      (metric: any) => metric.date >= start && metric.date <= end
    );

    // Calcular totais do período
    const totals = dailyMetrics.reduce((acc: any, metric: any) => ({
      totalAppointments: acc.totalAppointments + metric.totalAppointments,
      completedAppointments: acc.completedAppointments + metric.completedAppointments,
      canceledAppointments: acc.canceledAppointments + metric.canceledAppointments,
      newPatients: acc.newPatients + metric.newPatients,
      reportsGenerated: acc.reportsGenerated + metric.reportsGenerated,
    }), {
      totalAppointments: 0,
      completedAppointments: 0,
      canceledAppointments: 0,
      newPatients: 0,
      reportsGenerated: 0,
    });

    // Calcular médias
    const averages = {
      appointmentsPerDay: totals.totalAppointments / dailyMetrics.length,
      completionRate: (totals.completedAppointments / totals.totalAppointments) * 100,
      cancellationRate: (totals.canceledAppointments / totals.totalAppointments) * 100,
    };

    return NextResponse.json({
      period: { start, end },
      totals,
      averages,
      dailyMetrics,
    });
  } catch (error: any) {
    console.error('Erro ao obter análises:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// POST: Atualizar métricas
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const data = await request.json();
    await connectToDatabase();

    let analytics = await Analytics.findOne({});
    if (!analytics) {
      analytics = new Analytics({});
    }

    // Atualizar métricas com base no tipo
    switch (data.type) {
      case 'daily':
        analytics.dailyMetrics.push(data.metrics);
        break;
      case 'progress':
        analytics.patientProgress.push(data.metrics);
        break;
      case 'productivity':
        analytics.productivityMetrics.push(data.metrics);
        break;
      default:
        return NextResponse.json({ error: 'Tipo de métrica inválido' }, { status: 400 });
    }

    analytics.lastUpdated = new Date();
    await analytics.save();

    return NextResponse.json({ message: 'Métricas atualizadas com sucesso' });
  } catch (error: any) {
    console.error('Erro ao atualizar métricas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// DELETE: Limpar métricas antigas
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const olderThan = searchParams.get('olderThan') || '365'; // Padrão: 1 ano
    const date = new Date();
    date.setDate(date.getDate() - parseInt(olderThan));

    await connectToDatabase();
    const analytics = await Analytics.findOne({});

    if (!analytics) {
      return NextResponse.json({ error: 'Nenhum dado encontrado' }, { status: 404 });
    }

    // Remover métricas antigas
    analytics.dailyMetrics = analytics.dailyMetrics.filter(
      (metric: any) => metric.date >= date
    );
    analytics.patientProgress = analytics.patientProgress.filter(
      (progress: any) => progress.date >= date
    );
    analytics.productivityMetrics = analytics.productivityMetrics.filter(
      (metric: any) => metric.period.end >= date
    );

    await analytics.save();

    return NextResponse.json({ message: 'Métricas antigas removidas com sucesso' });
  } catch (error: any) {
    console.error('Erro ao limpar métricas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
} 