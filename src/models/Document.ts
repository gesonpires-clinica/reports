import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
  },
  uploadedBy: {
    type: String,
    required: true,
  },
  tags: [String],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

documentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema); 