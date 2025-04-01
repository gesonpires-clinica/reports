"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CommonPhrase {
  _id: string;
  content: string;
  category: string;
  tags: string[];
  usageCount: number;
}

interface CommonPhrasesProps {
  category: string;
  onSelect: (phrase: string) => void;
}

export function CommonPhrases({ category, onSelect }: CommonPhrasesProps) {
  const [phrases, setPhrases] = useState<CommonPhrase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPhrases();
  }, [category]);

  const fetchPhrases = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/common-phrases?category=${category}`);
      if (!response.ok) throw new Error("Erro ao buscar frases");
      const data = await response.json();
      setPhrases(data);
    } catch (error) {
      toast.error("Erro ao carregar frases comuns");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhrases = phrases.filter((phrase) =>
    phrase.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search">Buscar frases</Label>
        <Input
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite para buscar..."
        />
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          filteredPhrases.map((phrase) => (
            <Button
              key={phrase._id}
              variant="outline"
              className="w-full text-left justify-start"
              onClick={() => onSelect(phrase.content)}
            >
              {phrase.content}
            </Button>
          ))
        )}
      </div>
    </div>
  );
} 