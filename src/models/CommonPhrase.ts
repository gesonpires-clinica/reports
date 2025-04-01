import mongoose from "mongoose";

const commonPhraseSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["anamnese", "avaliacao", "conclusao", "recomendacoes"],
  },
  tags: [{
    type: String,
  }],
  usageCount: {
    type: Number,
    default: 0,
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

commonPhraseSchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

export const CommonPhrase = mongoose.models.CommonPhrase || mongoose.model("CommonPhrase", commonPhraseSchema); 