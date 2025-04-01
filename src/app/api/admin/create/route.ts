import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { encryption } from '@/lib/encryption';

export async function POST(request: Request) {
  try {
    const { adminKey } = await request.json();
    
    // Verifica a chave de segurança
    if (adminKey !== process.env.ADMIN_CREATION_KEY) {
      return NextResponse.json({ error: 'Chave de segurança inválida' }, { status: 401 });
    }

    await connectToDatabase();

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // Altere esta senha em produção

    // Verifica se já existe um usuário admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Usuário admin já existe' });
    }

    // Cria o usuário admin
    const hashedPassword = encryption.hash(adminPassword);
    await User.create({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    return NextResponse.json({ message: 'Usuário admin criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    return NextResponse.json({ error: 'Erro ao criar usuário admin' }, { status: 500 });
  }
} 