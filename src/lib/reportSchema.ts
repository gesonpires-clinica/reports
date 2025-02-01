import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    identificacao: { type: String, required: true },
    queixa: { type: String, required: true },
    historico: { type: String, required: true },
    subtituloHistorico: { type: String }, // opcional
    vidaEscolar: { type: String, required: true },
    comportamento: { type: String, required: true },
    avaliacaoInstrumentos: { type: String, required: true },
    avaliacaoSintese: { type: String, required: true },
    conclusao: { type: String, required: true },
    fechamento: { type: String, required: true },
    localData: { type: String, required: true },
    assinatura: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "reports" } // Define o nome da coleção no banco
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
