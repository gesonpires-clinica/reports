import mongoose from 'mongoose';
import { encryption } from '@/lib/encryption';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'user'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Middleware para criptografar a senha antes de salvar
userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = encryption.hash(this.password);
  }
  next();
});

// Método para verificar a senha
userSchema.methods.comparePassword = function(candidatePassword: string) {
  return encryption.hash(candidatePassword) === this.password;
};

export const User = mongoose.models.User || mongoose.model('User', userSchema); 