import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Integration } from '@/models/Integration';
import { AccessLog } from '@/models/AccessLog';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { name, type, provider, config, credentials } = body;

    await connectToDatabase();

    // Verifica se já existe uma integração com o mesmo nome
    const existingIntegration = await Integration.findOne({ name });
    if (existingIntegration) {
      return NextResponse.json(
        { error: 'Já existe uma integração com este nome' },
        { status: 400 }
      );
    }

    // Cria a integração
    const integration = await Integration.create({
      name,
      type,
      provider,
      config,
      credentials,
    });

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'create_integration',
      details: `Integração ${name} criada`,
    });

    return NextResponse.json(integration);
  } catch (error: any) {
    console.error('Erro ao criar integração:', error);
    return NextResponse.json(
      { error: 'Erro ao criar integração' },
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
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    await connectToDatabase();

    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const integrations = await Integration.find(query).select('-credentials');

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'list_integrations',
      details: `Listagem de integrações`,
    });

    return NextResponse.json(integrations);
  } catch (error: any) {
    console.error('Erro ao listar integrações:', error);
    return NextResponse.json(
      { error: 'Erro ao listar integrações' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { id, config, credentials, status } = body;

    await connectToDatabase();

    const updateData: any = {};
    if (config) updateData.config = config;
    if (credentials) updateData.credentials = credentials;
    if (status) updateData.status = status;

    const integration = await Integration.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-credentials');

    if (!integration) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      );
    }

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'update_integration',
      details: `Integração ${id} atualizada`,
    });

    return NextResponse.json(integration);
  } catch (error: any) {
    console.error('Erro ao atualizar integração:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar integração' },
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
        { error: 'ID da integração não fornecido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const integration = await Integration.findByIdAndDelete(id);

    if (!integration) {
      return NextResponse.json(
        { error: 'Integração não encontrada' },
        { status: 404 }
      );
    }

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'delete_integration',
      details: `Integração ${id} excluída`,
    });

    return NextResponse.json({ message: 'Integração excluída com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir integração:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir integração' },
      { status: 500 }
    );
  }
} 