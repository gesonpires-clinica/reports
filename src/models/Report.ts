import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  patientAge: {
    type: Number,
    required: true,
  },
  anamnese: {
    type: String,
    required: true,
  },
  avaliacao: {
    type: String,
    required: true,
  },
  conclusao: {
    type: String,
    required: true,
  },
  recomendacoes: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reportSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

// Índices para melhorar a performance da busca
reportSchema.index({ patientName: "text", anamnese: "text", avaliacao: "text", conclusao: "text", recomendacoes: "text" });
reportSchema.index({ tags: 1 });
reportSchema.index({ createdAt: -1 });

export const Report = mongoose.models.Report || mongoose.model("Report", reportSchema); 