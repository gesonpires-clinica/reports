"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { DraftManager } from "@/components/DraftManager";
import { CommonPhrases } from "@/components/CommonPhrases";
import { toast } from "sonner";

const reportSchema = z.object({
  patientName: z.string().min(1, "Nome do paciente é obrigatório"),
  patientAge: z.number().min(0, "Idade deve ser maior que 0"),
  anamnese: z.string().min(1, "Anamnese é obrigatória"),
  avaliacao: z.string().min(1, "Avaliação é obrigatória"),
  conclusao: z.string().min(1, "Conclusão é obrigatória"),
  recomendacoes: z.string().min(1, "Recomendações são obrigatórias"),
  tags: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function NewReport() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"anamnese" | "avaliacao" | "conclusao" | "recomendacoes">("anamnese");
  const [reportId, setReportId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const onSubmit = async (data: ReportFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar relatório");

      const result = await response.json();
      setReportId(result._id);
      toast.success("Relatório criado com sucesso!");
      router.push("/reports");
    } catch (error) {
      toast.error("Erro ao criar relatório");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhraseSelect = (phrase: string) => {
    setValue(activeSection, phrase);
  };

  const handleDraftSelect = (content: string) => {
    setValue(activeSection, content);
  };

  const handleSaveDraft = async (content: string) => {
    if (!reportId) return;

    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          section: activeSection,
          reportId,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar rascunho");
      toast.success("Rascunho salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar rascunho");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Novo Relatório</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="patientName">Nome do Paciente</Label>
          <Input
            id="patientName"
            {...register("patientName")}
            className={errors.patientName ? "border-red-500" : ""}
          />
          {errors.patientName && (
            <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="patientAge">Idade</Label>
          <Input
            id="patientAge"
            type="number"
            {...register("patientAge", { valueAsNumber: true })}
            className={errors.patientAge ? "border-red-500" : ""}
          />
          {errors.patientAge && (
            <p className="text-red-500 text-sm mt-1">{errors.patientAge.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input
            id="tags"
            {...register("tags")}
            placeholder="Ex: dislexia, TDAH, autismo"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="anamnese">Anamnese</Label>
              <RichTextEditor
                content={watch("anamnese") || ""}
                onChange={(content) => setValue("anamnese", content)}
                placeholder="Digite a anamnese..."
                onSave={() => handleSaveDraft(watch("anamnese"))}
                onClick={() => setActiveSection("anamnese")}
              />
              {errors.anamnese && (
                <p className="text-red-500 text-sm mt-1">{errors.anamnese.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="avaliacao">Avaliação</Label>
              <RichTextEditor
                content={watch("avaliacao") || ""}
                onChange={(content) => setValue("avaliacao", content)}
                placeholder="Digite a avaliação..."
                onSave={() => handleSaveDraft(watch("avaliacao"))}
                onClick={() => setActiveSection("avaliacao")}
              />
              {errors.avaliacao && (
                <p className="text-red-500 text-sm mt-1">{errors.avaliacao.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="conclusao">Conclusão</Label>
              <RichTextEditor
                content={watch("conclusao") || ""}
                onChange={(content) => setValue("conclusao", content)}
                placeholder="Digite a conclusão..."
                onSave={() => handleSaveDraft(watch("conclusao"))}
                onClick={() => setActiveSection("conclusao")}
              />
              {errors.conclusao && (
                <p className="text-red-500 text-sm mt-1">{errors.conclusao.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="recomendacoes">Recomendações</Label>
              <RichTextEditor
                content={watch("recomendacoes") || ""}
                onChange={(content) => setValue("recomendacoes", content)}
                placeholder="Digite as recomendações..."
                onSave={() => handleSaveDraft(watch("recomendacoes"))}
                onClick={() => setActiveSection("recomendacoes")}
              />
              {errors.recomendacoes && (
                <p className="text-red-500 text-sm mt-1">{errors.recomendacoes.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-l pl-4">
              <h2 className="text-lg font-semibold mb-4">Frases Comuns</h2>
              <CommonPhrases category={activeSection} onSelect={handlePhraseSelect} />
            </div>

            {reportId && (
              <div className="border-l pl-4">
                <DraftManager
                  reportId={reportId}
                  section={activeSection}
                  onSelectDraft={handleDraftSelect}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/reports")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
} 