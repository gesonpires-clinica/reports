import mongoose from 'mongoose';

const integrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['scheduling', 'clinic', 'payment', 'other'],
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  config: {
    type: Map,
    of: String,
    required: true,
  },
  credentials: {
    type: Map,
    of: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error'],
    default: 'inactive',
  },
  lastSync: Date,
  errorMessage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

integrationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Criptografa as credenciais antes de salvar
integrationSchema.pre('save', function(next) {
  if (this.isModified('credentials')) {
    // TODO: Implementar criptografia das credenciais
  }
  next();
});

export const Integration = mongoose.models.Integration || mongoose.model('Integration', integrationSchema); 