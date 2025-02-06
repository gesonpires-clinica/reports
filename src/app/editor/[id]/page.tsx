"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Definição do tipo ReportData com a nova estrutura
type ReportData = {
  title: string;
  identificacao: {
    nome: string;
    dataNascimento: string;
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
  avaliacao: string;
  avaliacaoInstrumentos: string;
  avaliacaoSintese: string;
  conclusao: string;
  fechamento: string;
  localData: string;
  assinatura: string;
};

export default function EditReportPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  // Estado inicial com a estrutura completa
  const [form, setForm] = useState<ReportData>({
    title: "",
    identificacao: {
      nome: "",
      dataNascimento: "",
      idade: "",
      escolaridade: "",
      escola: "",
      dominanciaManual: "",
      pai: "",
      mae: "",
      medicamento: "Não",
    },
    queixa: "",
    historico: "",
    subtituloHistorico: "",
    vidaEscolar: "",
    comportamento: "",
    avaliacao: "",
    avaliacaoInstrumentos: "",
    avaliacaoSintese: "",
    conclusao: "",
    fechamento: "",
    localData: "",
    assinatura: "",
  });

  // Handler para campos fora do grupo "identificacao"
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler para campos dentro de "identificacao"
  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const [group, field] = name.split(".");
    if (group === "identificacao") {
      setForm((prev) => ({
        ...prev,
        identificacao: {
          ...prev.identificacao,
          [field]: value,
        },
      }));
      // Se necessário, calcule a idade automaticamente ao alterar a data de nascimento
      if (field === "dataNascimento") {
        const birthDate = new Date(value);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
        if (days < 0) {
          months -= 1;
          days += 30; // aproximação
        }
        if (months < 0) {
          years -= 1;
          months += 12;
        }
        const idadeStr = `${years} anos, ${months} meses e ${days} dias`;
        setForm((prev) => ({
          ...prev,
          identificacao: {
            ...prev.identificacao,
            idade: idadeStr,
          },
        }));
      }
    }
  };

  useEffect(() => {
    async function fetchReport() {
      const response = await fetch(`/api/reports/${id}`);
      if (response.ok) {
        const data = await response.json();
        // Certifique-se de que a API retorna os dados na mesma estrutura do ReportData
        setForm(data);
      } else {
        alert("Erro ao buscar os dados do relatório.");
      }
    }
    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/reports/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      alert("Relatório atualizado com sucesso!");
      router.push("/dashboard");
    } else {
      alert("Erro ao atualizar relatório.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Editar Relatório</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block font-bold mb-1">Título do Relatório</label>
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
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium">Nome do Paciente:</label>
                <Input
                  type="text"
                  name="identificacao.nome"
                  value={form.identificacao.nome}
                  onChange={handleNestedChange}
                  placeholder="Digite o nome do paciente"
                  required
                />
              </div>
              {/* Data de Nascimento e Idade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Data de Nascimento:</label>
                  <Input
                    type="date"
                    name="identificacao.dataNascimento"
                    value={form.identificacao.dataNascimento}
                    onChange={handleNestedChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Idade:</label>
                  <Input
                    type="text"
                    name="identificacao.idade"
                    value={form.identificacao.idade}
                    placeholder="Idade calculada"
                    readOnly
                  />
                </div>
              </div>
              {/* Escolaridade e Escola */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Escolaridade:</label>
                  <select
                    name="identificacao.escolaridade"
                    value={form.identificacao.escolaridade}
                    onChange={handleNestedChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="Fundamental">Fundamental</option>
                    <option value="Médio">Médio</option>
                    <option value="Superior">Superior</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Escola:</label>
                  <Input
                    type="text"
                    name="identificacao.escola"
                    value={form.identificacao.escola}
                    onChange={handleNestedChange}
                    placeholder="Nome da Escola"
                    required
                  />
                </div>
              </div>
              {/* Dominância Manual */}
              <div>
                <label className="block text-sm font-medium">Dominância Manual:</label>
                <select
                  name="identificacao.dominanciaManual"
                  value={form.identificacao.dominanciaManual}
                  onChange={handleNestedChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Destro">Destro</option>
                  <option value="Ambidestro">Ambidestro</option>
                </select>
              </div>
              {/* Pai e Mãe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Pai:</label>
                  <Input
                    type="text"
                    name="identificacao.pai"
                    value={form.identificacao.pai}
                    onChange={handleNestedChange}
                    placeholder="Nome do Pai"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Mãe:</label>
                  <Input
                    type="text"
                    name="identificacao.mae"
                    value={form.identificacao.mae}
                    onChange={handleNestedChange}
                    placeholder="Nome da Mãe"
                    required
                  />
                </div>
              </div>
              {/* Uso de Medicamento */}
              <div>
                <label className="block text-sm font-medium">Faz uso de medicamento:</label>
                <select
                  name="identificacao.medicamento"
                  value={form.identificacao.medicamento}
                  onChange={handleNestedChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="Não">Não</option>
                  <option value="Sim">Sim</option>
                </select>
              </div>
            </div>
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
            Atualizar Relatório
          </Button>
        </form>
      </div>
    </div>
  );
}
