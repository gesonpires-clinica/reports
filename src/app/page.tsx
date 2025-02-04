"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export type Report = {
  _id: string;
  title: string;
  identificacao: string;
  queixa: string;
  historico: string;
  subtituloHistorico?: string;
  vidaEscolar: string;
  comportamento: string;
  avaliacaoInstrumentos: string;
  avaliacaoSintese: string;
  conclusao: string;
  fechamento: string;
  localData: string;
  assinatura: string;
  createdAt: string;
};

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Erro ao buscar relatórios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Pré-visualização dos Relatórios
      </h1>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : reports.length === 0 ? (
        <p className="text-center">Nenhum relatório encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <Card key={report._id} className="p-4">
              <CardHeader>
                <CardTitle>{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Identificação:</strong> {report.identificacao}
                </p>
                <p>
                  <strong>Queixa:</strong> {report.queixa}
                </p>
                <p className="text-sm text-gray-500">
                  Criado em:{" "}
                  {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                </p>
                {/* Exibe um trecho da conclusão como exemplo; você pode ajustar qual campo deseja mostrar */}
                <p className="mt-2">
                  {report.conclusao.length > 100
                    ? report.conclusao.slice(0, 100) + "..."
                    : report.conclusao}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/reports/${report._id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Visualizar
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
