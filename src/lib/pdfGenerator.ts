// src/lib/pdfGenerator.ts

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";

// Configura as fontes virtuais
pdfMake.vfs = pdfFonts.vfs;

export type Report = {
  _id: string;
  title: string;
  identificacao: string;
  queixa: string;
  historico: string;
  subtituloHistorico?: string;
  vidaEscolar: string;
  comportamento: string;
  avaliacaoInstrumentos: string;
  avaliacaoSintese: string;
  conclusao: string;
  fechamento: string;
  localData: string;
  assinatura: string;
  createdAt: string;
};

export const generateEvaluationPDF = async (report: Report): Promise<void> => {
  const docDefinition: TDocumentDefinitions = {
    content: [
      {
        text: "Clínica Mariane Bach",
        style: "header",
        alignment: "center",
      },
      {
        text: `Psicopedagogia que transforma vidas`,
        style: "subheader",
        alignment: "center",
        margin: [0, 10, 0, 50],
      },
      {
        text: report.title.toUpperCase(),
        style: "title",
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      { text: "I - IDENTIFICAÇÃO", style: "sectionHeader" },
      { text: report.identificacao, style: "content", margin: [20, 0, 0, 10] },
      { text: "II - QUEIXA", style: "sectionHeader" },
      { text: report.queixa, style: "content", margin: [20, 0, 0, 10] },
      {
        text: "III - HISTÓRICO DO DESENVOLVIMENTO E DA SAÚDE",
        style: "sectionHeader",
      },
      { text: report.historico, style: "content", margin: [20, 0, 0, 10] },
      // Em vez de retornar um objeto vazio, usamos spread para adicionar o subtítulo apenas se existir.
      ...(report.subtituloHistorico
        ? [
            {
              text: `III.1 - ${report.subtituloHistorico}`,
              style: "subSectionHeader",
              margin: [20, 0, 0, 10] as [number, number, number, number],
            },
          ]
        : []),
      { text: "IV - VIDA ESCOLAR", style: "sectionHeader" },
      { text: report.vidaEscolar, style: "content", margin: [20, 0, 0, 10] },
      {
        text: "V - COMPORTAMENTO DO APRENDIZANTE DURANTE A AVALIAÇÃO",
        style: "sectionHeader",
      },
      { text: report.comportamento, style: "content", margin: [20, 0, 0, 10] },
      { text: "VI - AVALIAÇÃO", style: "sectionHeader" },
      {
        text: "VI.1 - Instrumentos:",
        style: "subSectionHeader",
        margin: [0, 10, 0, 5],
      },
      {
        text: report.avaliacaoInstrumentos,
        style: "content",
        margin: [20, 0, 0, 10],
      },
      {
        text: "VI.2 - Síntese dos resultados:",
        style: "subSectionHeader",
        margin: [0, 10, 0, 5],
      },
      {
        text: report.avaliacaoSintese,
        style: "content",
        margin: [20, 0, 0, 10],
      },
      { text: "VII - CONCLUSÃO", style: "sectionHeader" },
      { text: report.conclusao, style: "content", margin: [20, 0, 0, 10] },
      { text: "Fechamento:", style: "sectionHeader" },
      { text: report.fechamento, style: "content", margin: [20, 0, 0, 10] },
      { text: "Local e Data:", style: "sectionHeader" },
      { text: report.localData, style: "content", margin: [20, 0, 0, 10] },
      { text: "Assinatura:", style: "sectionHeader" },
      { text: report.assinatura, style: "content", margin: [20, 0, 0, 10] },
    ],
    footer: function(currentPage, pageCount) {
      return {
        text: `Data: ${new Date(report.createdAt).toLocaleDateString("pt-BR")} - p. ${currentPage}/${pageCount}`,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      };
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: "#000066",
      },
      subheader: {
        fontSize: 12,
        color: "#000000",
      },
      title: {
        fontSize: 16,
        bold: true,
      },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      subSectionHeader: {
        fontSize: 12,
        bold: true,
        margin: [20, 5, 0, 5],
      },
      content: {
        fontSize: 12,
        alignment: "justify", // Alinhamento justificado
      },
    },
    defaultStyle: {},
  };

  // Cria e baixa o PDF
  pdfMake.createPdf(docDefinition).download(`relatorio-${report._id}.pdf`);
};
