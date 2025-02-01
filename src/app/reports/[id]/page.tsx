"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Report = {
  _id: string;
  title: string;
  patientName: string;
  specialistName: string;
  content: string;
  createdAt: string;
};

export default function ReportDetailPage() {
  // Obtém o parâmetro de rota (id do relatório)
  const { id } = useParams() as { id: string };
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchReport() {
      const response = await fetch(`/api/reports/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
      setLoading(false);
    }
    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  if (!report) {
    return <p className="text-center mt-10">Relatório não encontrado.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">{report.title}</h1>
      <p>
        <strong>Paciente:</strong> {report.patientName}
      </p>
      <p>
        <strong>Especialista:</strong> {report.specialistName}
      </p>
      <p className="text-sm text-gray-500">
        Criado em: {new Date(report.createdAt).toLocaleDateString()}
      </p>
      <div className="mt-4">
        <p>{report.content}</p>
      </div>
      <div className="mt-4 flex space-x-2">
        <Button onClick={() => router.push(`/editor/${report._id}`)}>
          Editar
        </Button>
        <Button onClick={() => router.back()} variant="secondary">
          Voltar
        </Button>
      </div>
    </div>
  );
}
