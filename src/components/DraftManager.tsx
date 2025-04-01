"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Draft {
  _id: string;
  content: string;
  section: string;
  reportId: string;
  createdAt: string;
  updatedAt: string;
}

interface DraftManagerProps {
  reportId: string;
  section: string;
  onSelectDraft: (content: string) => void;
}

export function DraftManager({ reportId, section, onSelectDraft }: DraftManagerProps) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDrafts();
  }, [reportId, section]);

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/drafts?reportId=${reportId}&section=${section}`
      );
      if (!response.ok) throw new Error("Erro ao buscar rascunhos");
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      toast.error("Erro ao carregar rascunhos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/drafts?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erro ao excluir rascunho");
      toast.success("Rascunho excluído");
      fetchDrafts();
    } catch (error) {
      toast.error("Erro ao excluir rascunho");
    }
  };

  if (isLoading) return <p>Carregando rascunhos...</p>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Rascunhos</h3>
      {drafts.length === 0 ? (
        <p className="text-gray-500">Nenhum rascunho encontrado</p>
      ) : (
        <div className="space-y-2">
          {drafts.map((draft) => (
            <div
              key={draft._id}
              className="p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(draft.updatedAt).toLocaleString()}
                  </p>
                  <p className="mt-1 line-clamp-2">{draft.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectDraft(draft.content)}
                  >
                    Usar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(draft._id)}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 