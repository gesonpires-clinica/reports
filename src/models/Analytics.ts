import mongoose from 'mongoose';

// Schema para métricas diárias
const DailyMetricsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalAppointments: { type: Number, default: 0 },
  completedAppointments: { type: Number, default: 0 },
  canceledAppointments: { type: Number, default: 0 },
  newPatients: { type: Number, default: 0 },
  reportsGenerated: { type: Number, default: 0 },
  averageAppointmentDuration: { type: Number, default: 0 },
});

// Schema para evolução do paciente
const PatientProgressSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  date: { type: Date, required: true },
  metrics: {
    clinicalProgress: { type: Number, min: 0, max: 10 }, // Escala de 0-10
    treatmentAdherence: { type: Number, min: 0, max: 10 },
    overallWellbeing: { type: Number, min: 0, max: 10 },
  },
  notes: { type: String },
});

// Schema para produtividade do profissional
const ProductivityMetricsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  metrics: {
    totalAppointments: { type: Number, default: 0 },
    reportsGenerated: { type: Number, default: 0 },
    averageReportTime: { type: Number, default: 0 }, // em minutos
    patientSatisfaction: { type: Number, min: 0, max: 5 },
  },
});

// Schema principal de análises
const AnalyticsSchema = new mongoose.Schema({
  dailyMetrics: [DailyMetricsSchema],
  patientProgress: [PatientProgressSchema],
  productivityMetrics: [ProductivityMetricsSchema],
  lastUpdated: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Índices para otimização de consultas
AnalyticsSchema.index({ 'dailyMetrics.date': 1 });
AnalyticsSchema.index({ 'patientProgress.patientId': 1, 'patientProgress.date': 1 });
AnalyticsSchema.index({ 'productivityMetrics.userId': 1, 'productivityMetrics.period.start': 1 });

// Método para calcular médias de evolução do paciente
AnalyticsSchema.methods.getPatientProgressAverage = function(patientId, startDate, endDate) {
  const progress = this.patientProgress.filter(p => 
    p.patientId.equals(patientId) && 
    p.date >= startDate && 
    p.date <= endDate
  );

  if (progress.length === 0) return null;

  return {
    clinicalProgress: progress.reduce((acc, p) => acc + p.metrics.clinicalProgress, 0) / progress.length,
    treatmentAdherence: progress.reduce((acc, p) => acc + p.metrics.treatmentAdherence, 0) / progress.length,
    overallWellbeing: progress.reduce((acc, p) => acc + p.metrics.overallWellbeing, 0) / progress.length,
  };
};

// Método para calcular métricas de produtividade
AnalyticsSchema.methods.calculateProductivityTrends = function(userId, months = 3) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return this.productivityMetrics
    .filter(p => p.userId.equals(userId) && p.period.start >= startDate)
    .map(p => ({
      period: p.period,
      metrics: p.metrics,
      efficiency: (p.metrics.totalAppointments / p.metrics.averageReportTime) * p.metrics.patientSatisfaction,
    }));
};

export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema); 