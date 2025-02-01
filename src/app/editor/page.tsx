"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ReportData = {
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
};

export default function EditorPage() {
  const [form, setForm] = useState<ReportData>({
    title: "",
    identificacao: "",
    queixa: "",
    historico: "",
    subtituloHistorico: "",
    vidaEscolar: "",
    comportamento: "",
    avaliacaoInstrumentos: "",
    avaliacaoSintese: "",
    conclusao: "",
    fechamento: "",
    localData: "",
    assinatura: "",
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      alert("Relatório salvo com sucesso!");
      setForm({
        title: "",
        identificacao: "",
        queixa: "",
        historico: "",
        subtituloHistorico: "",
        vidaEscolar: "",
        comportamento: "",
        avaliacaoInstrumentos: "",
        avaliacaoSintese: "",
        conclusao: "",
        fechamento: "",
        localData: "",
        assinatura: "",
      });
      router.push("/dashboard");
    } else {
      alert("Erro ao salvar relatório.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Criar Novo Relatório
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block font-bold mb-1">
              Título do Relatório
            </label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título do Relatório"
              required
            />
          </div>

          {/* I - IDENTIFICAÇÃO */}
          <div>
            <label className="block font-bold mb-1">I - IDENTIFICAÇÃO</label>
            <textarea
              name="identificacao"
              value={form.identificacao}
              onChange={handleChange}
              placeholder="Insira os dados de identificação (Nome, Data de Nascimento, Escolaridade, etc.)"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* II - QUEIXA */}
          <div>
            <label className="block font-bold mb-1">II - QUEIXA</label>
            <textarea
              name="queixa"
              value={form.queixa}
              onChange={handleChange}
              placeholder="Descreva a queixa apresentada"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* III - HISTÓRICO DO DESENVOLVIMENTO E DA SAÚDE */}
          <div>
            <label className="block font-bold mb-1">
              III - HISTÓRICO DO DESENVOLVIMENTO E DA SAÚDE
            </label>
            <textarea
              name="historico"
              value={form.historico}
              onChange={handleChange}
              placeholder="Descreva o histórico do desenvolvimento e da saúde"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* III.1 - JEITO DE SER DA CRIANÇA, SEGUNDO OS PAIS (Opcional) */}
          <div>
            <label className="block font-bold mb-1">
              III.1 - Jeito de ser da criança, segundo os pais (Opcional)
            </label>
            <textarea
              name="subtituloHistorico"
              value={form.subtituloHistorico}
              onChange={handleChange}
              placeholder="Descreva o jeito de ser da criança, segundo os pais"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          {/* IV - VIDA ESCOLAR */}
          <div>
            <label className="block font-bold mb-1">IV - VIDA ESCOLAR</label>
            <textarea
              name="vidaEscolar"
              value={form.vidaEscolar}
              onChange={handleChange}
              placeholder="Descreva a vida escolar do aprendiz"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* V - COMPORTAMENTO DO APRENDIZANTE DURANTE A AVALIAÇÃO */}
          <div>
            <label className="block font-bold mb-1">
              V - COMPORTAMENTO DO APRENDIZANTE DURANTE A AVALIAÇÃO
            </label>
            <textarea
              name="comportamento"
              value={form.comportamento}
              onChange={handleChange}
              placeholder="Descreva o comportamento durante a avaliação"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* VI - AVALIAÇÃO */}
          <div>
            <label className="block font-bold mb-1">
              VI.1 - Instrumentos Utilizados
            </label>
            <textarea
              name="avaliacaoInstrumentos"
              value={form.avaliacaoInstrumentos}
              onChange={handleChange}
              placeholder="Liste os instrumentos utilizados"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <div>
            <label className="block font-bold mb-1">
              VI.2 - Síntese dos Resultados
            </label>
            <textarea
              name="avaliacaoSintese"
              value={form.avaliacaoSintese}
              onChange={handleChange}
              placeholder="Sintetize os resultados obtidos"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* VII - CONCLUSÃO */}
          <div>
            <label className="block font-bold mb-1">VII - CONCLUSÃO</label>
            <textarea
              name="conclusao"
              value={form.conclusao}
              onChange={handleChange}
              placeholder="Apresente a conclusão"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* Fechamento */}
          <div>
            <label className="block font-bold mb-1">Fechamento</label>
            <textarea
              name="fechamento"
              value={form.fechamento}
              onChange={handleChange}
              placeholder="Ex.: Coloco-me à disposição para maiores informações."
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>

          {/* Local e Data */}
          <div>
            <label className="block font-bold mb-1">Local e Data</label>
            <Input
              type="text"
              name="localData"
              value={form.localData}
              onChange={handleChange}
              placeholder="Ex.: Florianópolis, 07 de junho de 2024"
              required
            />
          </div>

          {/* Assinatura */}
          <div>
            <label className="block font-bold mb-1">Assinatura</label>
            <Input
              type="text"
              name="assinatura"
              value={form.assinatura}
              onChange={handleChange}
              placeholder="Ex.: Mariane Bach - Neuropsicopedagoga Clínica"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar Relatório
          </Button>
        </form>
      </div>
    </div>
  );
}
