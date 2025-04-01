import CryptoJS from 'crypto-js';

interface SignatureData {
  userId: string;
  timestamp: string;
  documentHash: string;
  signature: string;
}

export const digitalSignature = {
  generateSignature: (userId: string, content: string): SignatureData => {
    const timestamp = new Date().toISOString();
    const documentHash = CryptoJS.SHA256(content).toString();
    
    // Cria uma assinatura única combinando o hash do documento com o ID do usuário e timestamp
    const signatureData = `${documentHash}:${userId}:${timestamp}`;
    const signature = CryptoJS.HmacSHA256(signatureData, process.env.SIGNATURE_SECRET || 'your-secret-key').toString();

    return {
      userId,
      timestamp,
      documentHash,
      signature
    };
  },

  verifySignature: (content: string, signatureData: SignatureData): boolean => {
    const { userId, timestamp, documentHash, signature } = signatureData;
    
    // Gera o hash do documento atual
    const currentDocumentHash = CryptoJS.SHA256(content).toString();
    
    // Verifica se o hash do documento corresponde
    if (currentDocumentHash !== documentHash) {
      return false;
    }

    // Recria a assinatura para verificação
    const signatureDataString = `${documentHash}:${userId}:${timestamp}`;
    const expectedSignature = CryptoJS.HmacSHA256(
      signatureDataString,
      process.env.SIGNATURE_SECRET || 'your-secret-key'
    ).toString();

    // Compara as assinaturas
    return signature === expectedSignature;
  },

  formatSignature: (signatureData: SignatureData): string => {
    return `Assinado digitalmente por ${signatureData.userId} em ${new Date(signatureData.timestamp).toLocaleString()}`;
  }
}; 