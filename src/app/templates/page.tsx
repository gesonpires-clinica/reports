"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Template = {
  _id: string;
  title: string;
  description: string;
  sections: {
    queixa?: string;
    historico?: string;
    subtituloHistorico?: string;
    vidaEscolar?: string;
    comportamento?: string;
    avaliacaoInstrumentos?: string;
    avaliacaoSintese?: string;
    conclusao?: string;
    fechamento?: string;
  };
  tags: string[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/templates");
        if (response.ok) {
          const data = await response.json();
          setTemplates(data);
        } else {
          console.error("Erro ao buscar templates");
        }
      } catch (error) {
        console.error("Erro ao buscar templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este template?")) {
      try {
        const response = await fetch(`/api/templates/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setTemplates((prev) => prev.filter((template) => template._id !== id));
        } else {
          alert("Erro ao excluir template");
        }
      } catch (error) {
        console.error("Erro ao excluir template:", error);
        alert("Erro ao excluir template");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Carregando templates...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Templates de Relatório</h1>
        <Button onClick={() => router.push("/templates/new")}>
          Criar Novo Template
        </Button>
      </div>

      {templates.length === 0 ? (
        <div className="text-center mt-8">
          <p>Nenhum template encontrado.</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/templates/new")}
          >
            Criar Primeiro Template
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card key={template._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{template.title}</span>
                  {template.isDefault && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Padrão
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/templates/${template._id}`)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(template._id)}
                >
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