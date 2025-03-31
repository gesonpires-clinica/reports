"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type TemplateFormData = {
  title: string;
  description: string;
  sections: {
    queixa: string;
    historico: string;
    subtituloHistorico?: string;
    vidaEscolar: string;
    comportamento: string;
    avaliacaoInstrumentos: string;
    avaliacaoSintese: string;
    conclusao: string;
    fechamento: string;
  };
  tags: string[];
  isDefault: boolean;
};

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [form, setForm] = useState<TemplateFormData>({
    title: "",
    description: "",
    sections: {
      queixa: "",
      historico: "",
      subtituloHistorico: "",
      vidaEscolar: "",
      comportamento: "",
      avaliacaoInstrumentos: "",
      avaliacaoSintese: "",
      conclusao: "",
      fechamento: "",
    },
    tags: [],
    isDefault: false,
  });

  const [loading, setLoading] = useState(!isNew);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetchTemplate();
    }
  }, [isNew]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setForm(data);
      } else {
        alert("Erro ao carregar template");
        router.push("/templates");
      }
    } catch (error) {
      console.error("Erro ao carregar template:", error);
      alert("Erro ao carregar template");
      router.push("/templates");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (index: number) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isNew ? "/api/templates" : `/api/templates/${params.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          createdBy: "clinicaneuromarianebach@gmail.com", // Email do usuário atual
        }),
      });

      if (response.ok) {
        alert(isNew ? "Template criado com sucesso!" : "Template atualizado com sucesso!");
        router.push("/templates");
      } else {
        alert("Erro ao salvar template");
      }
    } catch (error) {
      console.error("Erro ao salvar template:", error);
      alert("Erro ao salvar template");
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isNew ? "Criar Novo Template" : "Editar Template"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Título do Template</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(index)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Input
            placeholder="Digite uma tag e pressione Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagAdd}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Seções do Template</h2>

          <div>
            <Label htmlFor="sections.queixa">Queixa</Label>
            <Textarea
              id="sections.queixa"
              name="sections.queixa"
              value={form.sections.queixa}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="sections.historico">Histórico</Label>
            <Textarea
              id="sections.historico"
              name="sections.historico"
              value={form.sections.historico}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="sections.subtituloHistorico">Subtítulo do Histórico</Label>
            <Input
              id="sections.subtituloHistorico"
              name="sections.subtituloHistorico"
              value={form.sections.subtituloHistorico}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="sections.vidaEscolar">Vida Escolar</Label>
            <Textarea
              id="sections.vidaEscolar"
              name="sections.vidaEscolar"
              value={form.sections.vidaEscolar}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="sections.comportamento">Comportamento</Label>
            <Textarea
              id="sections.comportamento"
              name="sections.comportamento"
              value={form.sections.comportamento}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="sections.avaliacaoInstrumentos">Instrumentos de Avaliação</Label>
            <Textarea
              id="sections.avaliacaoInstrumentos"
              name="sections.avaliacaoInstrumentos"
              value={form.sections.avaliacaoInstrumentos}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="sections.avaliacaoSintese">Síntese da Avaliação</Label>
            <Textarea
              id="sections.avaliacaoSintese"
              name="sections.avaliacaoSintese"
              value={form.sections.avaliacaoSintese}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="sections.conclusao">Conclusão</Label>
            <Textarea
              id="sections.conclusao"
              name="sections.conclusao"
              value={form.sections.conclusao}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="sections.fechamento">Fechamento</Label>
            <Textarea
              id="sections.fechamento"
              name="sections.fechamento"
              value={form.sections.fechamento}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/templates")}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {isNew ? "Criar Template" : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
} 