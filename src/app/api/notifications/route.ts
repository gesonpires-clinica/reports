import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Notification } from '@/models/Notification';
import { AccessLog } from '@/models/AccessLog';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    await connectToDatabase();

    const query: any = { userId: session.user.id };
    if (status) query.status = status;
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'list_notifications',
      details: `Listagem de notificações`,
    });

    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error('Erro ao listar notificações:', error);
    return NextResponse.json(
      { error: 'Erro ao listar notificações' },
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
    const { id, status } = body;

    await connectToDatabase();

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { status, readAt: status === 'read' ? new Date() : undefined },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'update_notification',
      details: `Notificação ${id} marcada como ${status}`,
    });

    return NextResponse.json(notification);
  } catch (error: any) {
    console.error('Erro ao atualizar notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar notificação' },
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
        { error: 'ID da notificação não fornecido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!notification) {
      return NextResponse.json(
        { error: 'Notificação não encontrada' },
        { status: 404 }
      );
    }

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'delete_notification',
      details: `Notificação ${id} excluída`,
    });

    return NextResponse.json({ message: 'Notificação excluída com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir notificação:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir notificação' },
      { status: 500 }
    );
  }
} 