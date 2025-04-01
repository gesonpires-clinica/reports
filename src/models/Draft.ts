import mongoose from "mongoose";

const draftSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
    enum: ["anamnese", "avaliacao", "conclusao", "recomendacoes"],
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

draftSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export const Draft = mongoose.models.Draft || mongoose.model("Draft", draftSchema); 