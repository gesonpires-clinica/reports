"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Atualize o tipo Report para refletir o novo schema
export type Report = {
  _id: string;
  title: string;
  identificacao: {
    nome: string;
    dataNascimento: string; // se a API enviar string, ou Date se for convertido
    idade: string;
    escolaridade: string;
    escola: string;
    dominanciaManual: string;
    pai: string;
    mae: string;
    medicamento: string;
  };
  queixa: string;
  historico: string;
  subtituloHistorico?: string;
  vidaEscolar: string;
  comportamento: string;
  avaliacao: string; // se esse campo for utilizado
  avaliacaoInstrumentos: string;
  avaliacaoSintese: string;
  conclusao: string;
  fechamento: string;
  localData: string;
  assinatura: string;
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
      
      {/* Seção de Identificação */}
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Identificação</h2>
        <p>
          <strong>Paciente:</strong> {report.identificacao.nome}
        </p>
        <p>
          <strong>Data de Nascimento:</strong>{" "}
          {new Date(report.identificacao.dataNascimento).toLocaleDateString("pt-BR")}
        </p>
        <p>
          <strong>Idade:</strong> {report.identificacao.idade}
        </p>
        <p>
          <strong>Escolaridade:</strong> {report.identificacao.escolaridade}
        </p>
        <p>
          <strong>Escola:</strong> {report.identificacao.escola}
        </p>
        <p>
          <strong>Dominância Manual:</strong> {report.identificacao.dominanciaManual}
        </p>
        <p>
          <strong>Pai:</strong> {report.identificacao.pai}
        </p>
        <p>
          <strong>Mãe:</strong> {report.identificacao.mae}
        </p>
        <p>
          <strong>Faz uso de medicamento:</strong> {report.identificacao.medicamento}
        </p>
      </section>

      {/* Outras seções */}
      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Queixa</h2>
        <p>{report.queixa}</p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Histórico do Desenvolvimento e da Saúde
        </h2>
        <p>{report.historico}</p>
        {report.subtituloHistorico && (
          <p className="mt-2">
            <strong>Observação:</strong> {report.subtituloHistorico}
          </p>
        )}
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Vida Escolar</h2>
        <p>{report.vidaEscolar}</p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Comportamento Durante a Avaliação
        </h2>
        <p>{report.comportamento}</p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Avaliação</h2>
        <p>
          <strong>Instrumentos:</strong> {report.avaliacaoInstrumentos}
        </p>
        <p>
          <strong>Síntese dos Resultados:</strong> {report.avaliacaoSintese}
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Conclusão</h2>
        <p>{report.conclusao}</p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Fechamento</h2>
        <p>{report.fechamento}</p>
      </section>

      <section className="mb-4">
        <p>
          <strong>Local e Data:</strong> {report.localData}
        </p>
        <p>
          <strong>Assinatura:</strong> {report.assinatura}
        </p>
      </section>

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
