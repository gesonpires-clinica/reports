const { connectToDatabase } = require('../lib/mongodb');
const { User } = require('../models/User');
const { encryption } = require('../lib/encryption');

async function createAdminUser() {
  try {
    await connectToDatabase();

    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // Altere esta senha em produção

    // Verifica se já existe um usuário admin
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Usuário admin já existe');
      return;
    }

    // Cria o usuário admin
    const hashedPassword = encryption.hash(adminPassword);
    await User.create({
      name: 'Administrador',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Usuário admin criado com sucesso');
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    process.exit();
  }
}

createAdminUser(); 