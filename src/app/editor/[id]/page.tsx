"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditReportPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [form, setForm] = useState({
    title: "",
    patientName: "",
    specialistName: "",
    content: "",
  });

  useEffect(() => {
    const fetchReport = async () => {
      const response = await fetch(`/api/reports/${id}`);
      if (response.ok) {
        const data = await response.json();
        setForm({
          title: data.title,
          patientName: data.patientName,
          specialistName: data.specialistName,
          content: data.content,
        });
      } else {
        alert("Erro ao buscar os dados do relatório.");
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Editar Relatório</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Título"
              required
            />
            <Input
              type="text"
              name="patientName"
              value={form.patientName}
              onChange={handleChange}
              placeholder="Nome do Paciente"
              required
            />
            <Input
              type="text"
              name="specialistName"
              value={form.specialistName}
              onChange={handleChange}
              placeholder="Nome do Especialista"
              required
            />
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Conteúdo do Relatório"
              className="w-full p-2 border rounded"
              required
            ></textarea>
          </div>
          <Button type="submit" className="w-full">
            Atualizar Relatório
          </Button>
        </form>
      </div>
    </div>
  );
}
