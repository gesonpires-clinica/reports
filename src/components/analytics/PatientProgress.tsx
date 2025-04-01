"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PatientProgressData {
  patientId: string;
  name: string;
  clinicalProgress: number;
  treatmentAdherence: number;
  overallWellbeing: number;
}

export function PatientProgress() {
  const [progressData, setProgressData] = useState<PatientProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics/patient-progress');
        if (!response.ok) throw new Error('Falha ao carregar dados de evolução dos pacientes');
        const data = await response.json();
        setProgressData(data);
      } catch (error) {
        console.error('Erro ao carregar dados de evolução dos pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return <div>Carregando evolução dos pacientes...</div>;
  }

  if (progressData.length === 0) {
    return <div>Nenhum dado de evolução disponível</div>;
  }

  return (
    <div className="space-y-4">
      {progressData.map((patient) => (
        <Card key={patient.patientId} className="p-4">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">{patient.name}</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm">Progresso Clínico</p>
                <Progress value={patient.clinicalProgress} max={10} />
              </div>
              <div>
                <p className="text-sm">Adesão ao Tratamento</p>
                <Progress value={patient.treatmentAdherence} max={10} />
              </div>
              <div>
                <p className="text-sm">Bem-estar Geral</p>
                <Progress value={patient.overallWellbeing} max={10} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 