"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const phraseSchema = z.object({
  content: z.string().min(1, "Conteúdo é obrigatório"),
  category: z.enum(["anamnese", "avaliacao", "conclusao", "recomendacoes"]),
  tags: z.string().optional(),
});

type PhraseFormData = z.infer<typeof phraseSchema>;

export default function CommonPhrasesPage() {
  const [phrases, setPhrases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PhraseFormData>({
    resolver: zodResolver(phraseSchema),
  });

  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/common-phrases");
      if (!response.ok) throw new Error("Erro ao buscar frases");
      const data = await response.json();
      setPhrases(data);
    } catch (error) {
      toast.error("Erro ao carregar frases comuns");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PhraseFormData) => {
    try {
      const response = await fetch("/api/common-phrases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()) : [],
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar frase");

      toast.success("Frase adicionada com sucesso!");
      reset();
      fetchPhrases();
    } catch (error) {
      toast.error("Erro ao adicionar frase");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Frases Comuns</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea
            id="content"
            {...register("content")}
            className={errors.content ? "border-red-500" : ""}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            {...register("category")}
            className="w-full p-2 border rounded"
          >
            <option value="anamnese">Anamnese</option>
            <option value="avaliacao">Avaliação</option>
            <option value="conclusao">Conclusão</option>
            <option value="recomendacoes">Recomendações</option>
          </select>
        </div>

        <div>
          <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
          <Input
            id="tags"
            {...register("tags")}
            placeholder="Ex: dislexia, TDAH, autismo"
          />
        </div>

        <Button type="submit">Adicionar Frase</Button>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Frases Existentes</h2>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid gap-4">
            {phrases.map((phrase) => (
              <div
                key={phrase._id}
                className="p-4 border rounded-lg space-y-2"
              >
                <p className="font-medium">{phrase.content}</p>
                <div className="flex gap-2 text-sm text-gray-600">
                  <span>Categoria: {phrase.category}</span>
                  {phrase.tags?.length > 0 && (
                    <span>Tags: {phrase.tags.join(", ")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 