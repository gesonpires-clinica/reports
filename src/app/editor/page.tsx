"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/RichTextEditor";

// Atualize o tipo para incluir subcampos em "identificacao"
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

export default function EditorPage() {
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
      medicamento: "Não", // valor padrão
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

  const router = useRouter();

  // Manipulador para campos simples (fora do grupo "identificacao")
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Manipulador para campos aninhados em "identificacao"
  const handleNestedChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    // Espera o nome no formato "identificacao.campo"
    const [group, field] = name.split(".");
    if (group === "identificacao") {
      setForm((prev) => ({
        ...prev,
        identificacao: {
          ...prev.identificacao,
          [field]: value,
        },
      }));
      // Se o campo for dataNascimento, calcule automaticamente a idade
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
      router.push("/dashboard");
    } else {
      alert("Erro ao salvar relatório.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Criar novo relatório
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block font-bold mb-1">Título</label>
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título do Relatório"
              required
            />
          </div>

          {/* I - IDENTIFICAÇÃO com subcampos */}
          <div>
            <label className="block font-bold mb-1">I - IDENTIFICAÇÃO</label>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Nome do Paciente:
                </label>
                <Input
                  type="text"
                  name="identificacao.nome"
                  value={form.identificacao.nome}
                  onChange={handleNestedChange}
                  placeholder="Nome do Paciente"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Data do Nascimento:
                </label>
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
              <div>
                <label className="block text-sm font-medium">
                  Escolaridade:
                </label>
                <select
                  name="identificacao.escolaridade"
                  value={form.identificacao.escolaridade}
                  onChange={handleNestedChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Fundamental">Infantil I</option>
                  <option value="Médio">Infantil II</option>
                  <option value="Superior">Infantil III</option>
                  <option value="Superior">1º EF</option>
                  <option value="Superior">2º EF</option>
                  <option value="Superior">3º EF</option>
                  <option value="Superior">4º EF</option>
                  <option value="Superior">5º EF</option>
                  <option value="Superior">6º EF</option>
                  <option value="Superior">7º EF</option>
                  <option value="Superior">8º EF</option>
                  <option value="Superior">9º EF</option>
                  <option value="Superior">1º EM</option>
                  <option value="Superior">2º EM</option>
                  <option value="Superior">3º EM</option>
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
              <div>
                <label className="block text-sm font-medium">
                  Dominância Manual:
                </label>
                <select
                  name="identificacao.dominanciaManual"
                  value={form.identificacao.dominanciaManual}
                  onChange={handleNestedChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Destro">Destra</option>
                  <option value="Ambidestro">Ambidestra</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Pai/responsável:</label>
                <Input
                  type="text"
                  name="identificacao.pai"
                  value={form.identificacao.pai}
                  onChange={handleNestedChange}
                  placeholder="Nome do pai/responsável"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mãe/responsável:</label>
                <Input
                  type="text"
                  name="identificacao.mae"
                  value={form.identificacao.mae}
                  onChange={handleNestedChange}
                  placeholder="Nome da mãe/responsável"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Faz uso de medicamento:
                </label>
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
            <RichTextEditor
              content={form.queixa}
              onChange={(content) => setForm({ ...form, queixa: content })}
              placeholder="Descreva a queixa apresentada"
            />
          </div>

          {/* III - HISTÓRICO */}
          <div>
            <label className="block font-bold mb-1">
              III - HISTÓRICO DO DESENVOLVIMENTO E DA SAÚDE
            </label>
            <RichTextEditor
              content={form.historico}
              onChange={(content) => setForm({ ...form, historico: content })}
              placeholder="Descreva o histórico do desenvolvimento e da saúde"
            />
          </div>

          {/* III.1 - JEITO DE SER DA CRIANÇA */}
          <div>
            <label className="block font-bold mb-1">
              III.1 - Jeito de ser da criança, segundo os pais (Opcional)
            </label>
            <RichTextEditor
              content={form.subtituloHistorico || ""}
              onChange={(content) => setForm({ ...form, subtituloHistorico: content })}
              placeholder="Descreva o jeito de ser da criança, segundo os pais"
            />
          </div>

          {/* IV - VIDA ESCOLAR */}
          <div>
            <label className="block font-bold mb-1">IV - VIDA ESCOLAR</label>
            <RichTextEditor
              content={form.vidaEscolar}
              onChange={(content) => setForm({ ...form, vidaEscolar: content })}
              placeholder="Descreva a vida escolar do aprendiz"
            />
          </div>

          {/* V - COMPORTAMENTO */}
          <div>
            <label className="block font-bold mb-1">
              V - COMPORTAMENTO DO APRENDIZANTE DURANTE A AVALIAÇÃO
            </label>
            <RichTextEditor
              content={form.comportamento}
              onChange={(content) => setForm({ ...form, comportamento: content })}
              placeholder="Descreva o comportamento durante a avaliação"
            />
          </div>

          {/* VI - AVALIAÇÃO */}
          <div>
            <label className="block font-bold mb-1">VI - AVALIAÇÃO</label>
            <RichTextEditor
              content={form.avaliacao}
              onChange={(content) => setForm({ ...form, avaliacao: content })}
              placeholder="Insira a introdução sobre a avaliação."
            />
          </div>

          {/* VI.1 - INSTRUMENTOS */}
          <div>
            <label className="block font-bold mb-1">
              VI.1 - Instrumentos Utilizados
            </label>
            <RichTextEditor
              content={form.avaliacaoInstrumentos}
              onChange={(content) => setForm({ ...form, avaliacaoInstrumentos: content })}
              placeholder="Liste os instrumentos utilizados"
            />
          </div>

          {/* VI.2 - SÍNTESE */}
          <div>
            <label className="block font-bold mb-1">
              VI.2 - Síntese dos Resultados
            </label>
            <RichTextEditor
              content={form.avaliacaoSintese}
              onChange={(content) => setForm({ ...form, avaliacaoSintese: content })}
              placeholder="Sintetize os resultados obtidos"
            />
          </div>

          {/* VII - CONCLUSÃO */}
          <div>
            <label className="block font-bold mb-1">VII - CONCLUSÃO</label>
            <RichTextEditor
              content={form.conclusao}
              onChange={(content) => setForm({ ...form, conclusao: content })}
              placeholder="Apresente a conclusão"
            />
          </div>

          {/* Fechamento */}
          <div>
            <label className="block font-bold mb-1">Fechamento</label>
            <RichTextEditor
              content={form.fechamento}
              onChange={(content) => setForm({ ...form, fechamento: content })}
              placeholder="Ex.: Coloco-me à disposição para maiores informações."
            />
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
