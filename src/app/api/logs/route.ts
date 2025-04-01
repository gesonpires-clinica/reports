import { NextResponse } from 'next/server';
import { AccessLog } from '@/models/AccessLog';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Log } from '@/models/Log';

export async function GET() {
  try {
    await connectToDatabase();
    
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(100);
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    return NextResponse.json({ error: 'Erro ao buscar logs' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectToDatabase();
    
    // Remove logs mais antigos que 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await Log.deleteMany({ timestamp: { $lt: thirtyDaysAgo } });
    
    return NextResponse.json({ message: 'Logs antigos removidos com sucesso' });
  } catch (error) {
    console.error('Erro ao limpar logs:', error);
    return NextResponse.json({ error: 'Erro ao limpar logs' }, { status: 500 });
  }
} 