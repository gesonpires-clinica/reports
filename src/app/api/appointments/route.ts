import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Appointment } from '@/models/Appointment';
import { Notification } from '@/models/Notification';
import { AccessLog } from '@/models/AccessLog';

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { patientId, patientName, date, time, duration, type, notes } = body;

    await connectToDatabase();

    // Cria o agendamento
    const appointment = await Appointment.create({
      patientId,
      patientName,
      date,
      time,
      duration,
      type,
      notes,
    });

    // Cria uma notificação para o agendamento
    await Notification.create({
      userId: session.user.id,
      type: 'appointment',
      title: 'Novo Agendamento',
      message: `Agendamento criado para ${patientName} em ${date} às ${time}`,
      relatedId: appointment._id,
      scheduledFor: new Date(date),
    });

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'create_appointment',
      details: `Agendamento criado para ${patientName}`,
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar agendamento' },
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const patientId = searchParams.get('patientId');

    await connectToDatabase();

    const query: any = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (patientId) {
      query.patientId = patientId;
    }

    const appointments = await Appointment.find(query).sort({ date: 1, time: 1 });

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'list_appointments',
      details: `Listagem de agendamentos`,
    });

    return NextResponse.json(appointments);
  } catch (error: any) {
    console.error('Erro ao listar agendamentos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar agendamentos' },
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
    const { id, status, notes } = body;

    await connectToDatabase();

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'update_appointment',
      details: `Agendamento ${id} atualizado`,
    });

    return NextResponse.json(appointment);
  } catch (error: any) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar agendamento' },
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
        { error: 'ID do agendamento não fornecido' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado' },
        { status: 404 }
      );
    }

    // Registra o log de acesso
    await AccessLog.create({
      userId: session.user.id,
      action: 'delete_appointment',
      details: `Agendamento ${id} excluído`,
    });

    return NextResponse.json({ message: 'Agendamento excluído com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir agendamento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir agendamento' },
      { status: 500 }
    );
  }
} 