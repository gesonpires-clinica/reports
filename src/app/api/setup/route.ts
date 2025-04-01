import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();

    // Verifica se já existe um usuário admin
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      // Se existir, atualiza a senha
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      return NextResponse.json({ message: 'Senha do admin atualizada com sucesso' });
    }

    // Se não existir, cria um novo usuário admin
    const admin = new User({
      name: 'Administrador',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    await admin.save();

    return NextResponse.json({ message: 'Usuário admin criado com sucesso' });
  } catch (error) {
    console.error('Erro ao configurar usuário admin:', error);
    return NextResponse.json({ error: 'Erro ao configurar usuário admin' }, { status: 500 });
  }
}

// Mantém o suporte para POST também
export async function POST() {
  return GET();
} 