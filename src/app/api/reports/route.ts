import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Report } from "@/models/Report";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { digitalSignature } from '@/lib/digitalSignature';
import { AccessLog } from '@/models/AccessLog';

// Criar um novo relatório
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    // Gera a assinatura digital
    const content = JSON.stringify({
      patientName: body.patientName,
      patientId: body.patientId,
      date: body.date,
      anamnese: body.anamnese,
      avaliacao: body.avaliacao,
      conclusao: body.conclusao,
      recomendacoes: body.recomendacoes
    });

    const signatureData = digitalSignature.generateSignature(session.user.id, content);

    const report = await Report.create({
      ...body,
      digitalSignature: signatureData
    });

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'create',
      resource: 'report',
      resourceId: report._id,
      ipAddress: req.headers.get('x-user-ip') || 'unknown',
      userAgent: req.headers.get('x-user-agent') || 'unknown'
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar relatório:", error);
    return NextResponse.json({ error: "Erro ao criar relatório" }, { status: 500 });
  }
}

// Buscar todos os relatórios
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    await connectToDatabase();
    
    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'read',
      resource: 'report',
      ipAddress: req.headers.get('x-user-ip') || 'unknown',
      userAgent: req.headers.get('x-user-agent') || 'unknown'
    });

    const reports = await Report.find({}).sort({ createdAt: -1 });
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar relatórios:", error);
    return NextResponse.json({ error: "Erro ao buscar relatórios" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    await connectToDatabase();

    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json({ error: 'Relatório não encontrado' }, { status: 404 });
    }

    // Verifica se o relatório já foi assinado
    if (report.digitalSignature) {
      return NextResponse.json({ error: 'Relatório já assinado e não pode ser modificado' }, { status: 400 });
    }

    // Gera a assinatura digital
    const content = JSON.stringify({
      patientName: report.patientName,
      patientId: report.patientId,
      date: report.date,
      anamnese: report.anamnese,
      avaliacao: report.avaliacao,
      conclusao: report.conclusao,
      recomendacoes: report.recomendacoes
    });

    const signatureData = digitalSignature.generateSignature(session.user.id, content);
    report.digitalSignature = signatureData;
    await report.save();

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'update',
      resource: 'report',
      resourceId: report._id,
      ipAddress: req.headers.get('x-user-ip') || 'unknown',
      userAgent: req.headers.get('x-user-agent') || 'unknown'
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Erro ao assinar relatório:', error);
    return NextResponse.json({ error: 'Erro ao assinar relatório' }, { status: 500 });
  }
}
