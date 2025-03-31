import mongoose from "mongoose";
import { z } from "zod";

const TemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    sections: {
      queixa: { type: String },
      historico: { type: String },
      subtituloHistorico: { type: String },
      vidaEscolar: { type: String },
      comportamento: { type: String },
      avaliacaoInstrumentos: { type: String },
      avaliacaoSintese: { type: String },
      conclusao: { type: String },
      fechamento: { type: String }
    },
    tags: [{ type: String }], // Para categorização (ex: TDAH, Dislexia, etc.)
    isDefault: { type: Boolean, default: false }, // Para templates padrão do sistema
    createdBy: { type: String, required: true }, // Email do usuário que criou
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { collection: "templates" }
);

// Middleware para atualizar updatedAt antes de salvar
TemplateSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Template || mongoose.model("Template", TemplateSchema);

export const templateSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(100, "O título deve ter no máximo 100 caracteres"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  category: z.string().min(1, "A categoria é obrigatória"),
  description: z.string().optional(),
});

export type TemplateFormData = z.infer<typeof templateSchema>; 