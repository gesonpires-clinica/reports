import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    identificacao: {
      nome: { type: String, required: true },
      dataNascimento: { type: Date, required: true },
      idade: { type: String, required: true }, // Pode ser calculado a partir da dataNascimento
      escolaridade: { type: String, required: true },
      escola: { type: String, required: true },
      dominanciaManual: { type: String, required: true },
      pai: { type: String, required: true },
      mae: { type: String, required: true },
      medicamento: { type: String, required: true, default: "Não" }
    },
    queixa: { type: String, required: true },
    historico: { type: String, required: true },
    subtituloHistorico: { type: String }, // opcional
    vidaEscolar: { type: String, required: true },
    comportamento: { type: String, required: true },
    avaliacao: { type: String, required: true },
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
