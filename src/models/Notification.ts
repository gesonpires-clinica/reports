import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['appointment', 'report', 'document', 'system'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type',
  },
  scheduledFor: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readAt: Date,
});

notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Expira após 30 dias

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema); 