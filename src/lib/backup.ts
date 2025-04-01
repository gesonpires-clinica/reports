import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { Report } from '@/models/Report';
import { Template } from '@/models/Template';
import { CommonPhrase } from '@/models/CommonPhrase';
import { Draft } from '@/models/Draft';
import { encryption } from './encryption';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Garante que o diretório de backup existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export const backup = {
  async createBackup() {
    try {
      await connectToDatabase();
      
      // Coleta dados de todas as coleções
      const reports = await Report.find({});
      const templates = await Template.find({});
      const commonPhrases = await CommonPhrase.find({});
      const drafts = await Draft.find({});

      // Cria objeto com todos os dados
      const backupData = {
        timestamp: new Date().toISOString(),
        reports,
        templates,
        commonPhrases,
        drafts
      };

      // Criptografa os dados
      const encryptedData = encryption.encrypt(JSON.stringify(backupData));

      // Gera nome do arquivo com timestamp
      const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.enc`;
      const filePath = path.join(BACKUP_DIR, fileName);

      // Salva o backup
      fs.writeFileSync(filePath, encryptedData);

      // Remove backups antigos (mantém apenas os últimos 7 dias)
      const files = fs.readdirSync(BACKUP_DIR);
      const now = new Date();
      files.forEach(file => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        const daysOld = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysOld > 7) {
          fs.unlinkSync(filePath);
        }
      });

      return { success: true, fileName };
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      return { success: false, error: error.message };
    }
  },

  async restoreBackup(fileName: string) {
    try {
      const filePath = path.join(BACKUP_DIR, fileName);
      
      if (!fs.existsSync(filePath)) {
        throw new Error('Arquivo de backup não encontrado');
      }

      // Lê e descriptografa os dados
      const encryptedData = fs.readFileSync(filePath, 'utf-8');
      const decryptedData = encryption.decrypt(encryptedData);
      const backupData = JSON.parse(decryptedData);

      await connectToDatabase();

      // Limpa as coleções existentes
      await Report.deleteMany({});
      await Template.deleteMany({});
      await CommonPhrase.deleteMany({});
      await Draft.deleteMany({});

      // Restaura os dados
      await Report.insertMany(backupData.reports);
      await Template.insertMany(backupData.templates);
      await CommonPhrase.insertMany(backupData.commonPhrases);
      await Draft.insertMany(backupData.drafts);

      return { success: true };
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return { success: false, error: error.message };
    }
  }
}; 