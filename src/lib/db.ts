import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb:////127.0.0.1:27017/relatorios";

// Função para conectar ao MongoDB
export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return; // Já conectado
    }
    await mongoose.connect(MONGO_URI);
    console.log("🔥 Conectado ao MongoDB");
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB", error);
    process.exit(1); // Fecha o processo em caso de erro grave
  }
};
