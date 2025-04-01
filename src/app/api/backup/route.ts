import { NextResponse } from 'next/server';
import { backup } from '@/lib/backup';
import { AccessLog } from '@/models/AccessLog';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import path from 'path';
import fs from 'fs';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'create',
      resource: 'backup',
      ipAddress: '127.0.0.1', // TODO: Implementar captura real do IP
      userAgent: 'Server'
    });

    const result = await backup.createBackup();
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, fileName: result.fileName });
  } catch (error) {
    console.error('Erro ao criar backup:', error);
    return NextResponse.json({ error: 'Erro ao criar backup' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'read',
      resource: 'backup',
      ipAddress: '127.0.0.1', // TODO: Implementar captura real do IP
      userAgent: 'Server'
    });

    const backupDir = path.join(process.cwd(), 'backups');
    const files = fs.readdirSync(backupDir);
    
    const backups = files.map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        fileName: file,
        createdAt: stats.mtime,
        size: stats.size
      };
    });

    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Erro ao listar backups:', error);
    return NextResponse.json({ error: 'Erro ao listar backups' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { fileName } = await request.json();
    
    if (!fileName) {
      return NextResponse.json({ error: 'Nome do arquivo não fornecido' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'update',
      resource: 'backup',
      ipAddress: '127.0.0.1', // TODO: Implementar captura real do IP
      userAgent: 'Server'
    });

    const result = await backup.restoreBackup(fileName);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    return NextResponse.json({ error: 'Erro ao restaurar backup' }, { status: 500 });
  }
} 