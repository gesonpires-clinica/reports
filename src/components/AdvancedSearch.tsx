"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AdvancedSearchProps {
  onSearch: (params: SearchParams) => void;
}

interface SearchParams {
  q?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params: SearchParams = {
      q: searchTerm || undefined,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: 1,
    };

    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="search">Buscar por texto</Label>
        <Input
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Digite para buscar..."
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Ex: dislexia, TDAH, autismo"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Data inicial</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="endDate">Data final</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Buscar
      </Button>
    </form>
  );
} 