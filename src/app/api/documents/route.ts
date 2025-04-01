import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { connectToDatabase } from '@/lib/mongodb';
import { Document } from '@/models/Document';
import { AccessLog } from '@/models/AccessLog';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const patientId = formData.get('patientId') as string;
    const reportId = formData.get('reportId') as string;
    const description = formData.get('description') as string;
    const tags = (formData.get('tags') as string)?.split(',') || [];

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Gera um nome único para o arquivo
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define o caminho do arquivo
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, filename);

    // Salva o arquivo
    await writeFile(filePath, buffer);

    await connectToDatabase();

    // Cria o documento no banco de dados
    const document = await Document.create({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      path: `/uploads/${filename}`,
      patientId,
      reportId,
      uploadedBy: session.user.id,
      tags,
      description,
    });

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'upload_document',
      details: `Documento ${file.name} enviado para o paciente ${patientId}`,
    });

    return NextResponse.json(document);
  } catch (error: any) {
    console.error('Erro ao enviar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar documento' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const reportId = searchParams.get('reportId');

    await connectToDatabase();

    const query: any = {};
    if (patientId) query.patientId = patientId;
    if (reportId) query.reportId = reportId;

    const documents = await Document.find(query).sort({ createdAt: -1 });

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'list_documents',
      details: `Listagem de documentos`,
    });

    return NextResponse.json(documents);
  } catch (error: any) {
    console.error('Erro ao listar documentos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar documentos' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do documento não fornecido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    // TODO: Remover o arquivo físico do servidor

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'delete_document',
      details: `Documento ${id} excluído`,
    });

    return NextResponse.json({ message: 'Documento excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir documento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir documento' },
      { status: 500 }
    );
  }
} 