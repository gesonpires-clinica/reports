"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { toast } from "sonner";

interface Report {
  _id: string;
  patientName: string;
  patientAge: number;
  createdAt: string;
  tags: string[];
}

interface SearchParams {
  q?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  page?: number;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReports();
  }, [currentPage]);

  const fetchReports = async (searchParams?: SearchParams) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchParams?.q) params.append("q", searchParams.q);
      if (searchParams?.tags?.length) params.append("tags", searchParams.tags.join(","));
      if (searchParams?.startDate) params.append("startDate", searchParams.startDate);
      if (searchParams?.endDate) params.append("endDate", searchParams.endDate);
      params.append("page", currentPage.toString());
      params.append("limit", "10");

      const response = await fetch(`/api/reports/search?${params}`);
      if (!response.ok) throw new Error("Erro ao buscar relatórios");
      
      const data = await response.json();
      setReports(data.reports);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      toast.error("Erro ao carregar relatórios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (params: SearchParams) => {
    setCurrentPage(1);
    fetchReports(params);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <Link href="/reports/new">
          <Button>Novo Relatório</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {report.patientName}
                      </h2>
                      <p className="text-gray-600">
                        Idade: {report.patientAge} anos
                      </p>
                      <p className="text-sm text-gray-500">
                        Data: {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                      {report.tags?.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {report.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link href={`/reports/${report._id}`}>
                      <Button variant="outline">Ver Detalhes</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Busca Avançada</h2>
            <AdvancedSearch onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </div>
  );
} 