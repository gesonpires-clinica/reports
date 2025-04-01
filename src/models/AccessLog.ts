import mongoose from 'mongoose';

const accessLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'create', 'read', 'update', 'delete', 'export']
  },
  resource: {
    type: String,
    required: true,
    enum: ['report', 'template', 'common-phrase', 'draft']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'resource'
  },
  ipAddress: String,
  userAgent: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  }
});

export const AccessLog = mongoose.models.AccessLog || mongoose.model('AccessLog', accessLogSchema); 