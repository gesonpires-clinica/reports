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
    const adminPassword = 'admin123';
    const hashedPassword = encryption.hash(adminPassword);

    // Atualiza a senha do admin
    const result = await User.updateOne(
      { email: adminEmail },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Senha atualizada com sucesso',
      hashedPassword // Retorna o hash para verificação
    });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return NextResponse.json({ error: 'Erro ao atualizar senha' }, { status: 500 });
  }
} 