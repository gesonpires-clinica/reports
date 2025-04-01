import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // em minutos
    required: true,
    default: 60,
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  type: {
    type: String,
    required: true,
  },
  notes: String,
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
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

appointmentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema); 