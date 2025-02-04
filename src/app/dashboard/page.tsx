"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Importa a função de geração de PDF do arquivo separado
import { generateEvaluationPDF } from "@/lib/pdfGenerator";

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReports = async () => {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    };
    fetchReports();
  }, []);

  // Função para excluir relatório
  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este relatório?")) {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setReports((prev) => prev.filter((report) => report._id !== id));
      } else {
        alert("Erro ao excluir relatório.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Relatórios Salvos</h1>
      {reports.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Nenhum relatório encontrado.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((report) => (
            <Card key={report._id} className="transition hover:shadow-lg">
              <CardHeader>
                <CardTitle>
                  <Link href={`/reports/${report._id}`} className="hover:underline">
                    {report.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  <strong>Paciente:</strong> {report.patientName}
                </p>
                <p className="text-gray-700">
                  <strong>Especialista:</strong> {report.specialistName}
                </p>
                <p className="text-gray-500 text-sm">
                  Criado em: {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button onClick={() => generateEvaluationPDF(report)}>
                  Exportar PDF
                </Button>
                <Button onClick={() => router.push(`/editor/${report._id}`)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(report._id)}>
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
