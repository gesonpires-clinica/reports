// src/lib/pdfGenerator.ts

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { logoBase64 } from "@/assets/logo"; // ajuste o caminho conforme sua estrutura

// Configura as fontes virtuais
pdfMake.vfs = pdfFonts.vfs;

// Define um tipo auxiliar para a largura das colunas
type ColumnWidth = number | string;

export type Report = {
  _id: string;
  title: string;
  identificacao: {
    nome: string;
    dataNascimento: string; // ou Date, se preferir, mas aqui usaremos string para manter compatibilidade com o JSON
    idade: string;
    escolaridade: string;
    escola: string;
    dominanciaManual: string;
    pai: string;
    mae: string;
    medicamento: string;
  };
  queixa: string;
  historico: string;
  subtituloHistorico?: string;
  vidaEscolar: string;
  comportamento: string;
  avaliacao: string; // se houver, ou remova se não for usado
  avaliacaoInstrumentos: string;
  avaliacaoSintese: string;
  conclusao: string;
  fechamento: string;
  localData: string;
  assinatura: string;
  createdAt: string;
};

export const generateEvaluationPDF = async (report: Report): Promise<void> => {
  // Exemplo de logo em base64 – certifique-se de usar sua própria string
    const docDefinition: TDocumentDefinitions = {
    content: [
      // Header com 3 colunas: logo, textos centrais e informações de contato
      {
        columns: [
          {
            image: logoBase64,
            fit: [50, 50],
            alignment: "left",
            margin: [0, 10, 0, 25] as [number, number, number, number],
            width: "auto" as ColumnWidth,
          },
          {
            stack: [
              {
                text: "Clínica Mariane Bach",
                style: "header",
                alignment: "center",
              },
              {
                text: "Psicopedagogia que transforma vidas",
                fontSize: 10,
                style: "header",
                alignment: "center",
                margin: [0, 10, 0, 25] as [number, number, number, number],
              },
            ],
            margin: [0, 10, 0, 10] as [number, number, number, number],
            width: "*" as ColumnWidth,
          },
          {
            stack: [
              {
                text: "(48) 991228184",
                style: "subheader",
                alignment: "right",
              },
              {
                text: "clinicaneuromarianebach@gmail.com",
                style: "subheader",
                alignment: "right",
                margin: [0, 10, 0, 25] as [number, number, number, number],
              },
            ],
            margin: [0, 10, 0, 10] as [number, number, number, number],
            width: "auto" as ColumnWidth,
          },
        ],
        margin: [0, 10, 0, 10] as [number, number, number, number],
      },
      {
        text: report.title.toUpperCase(),
        style: "title",
        alignment: "center",
        margin: [0, 0, 0, 10],
      },
      // I - IDENTIFICAÇÃO com subcampos
      { text: "I - IDENTIFICAÇÃO", style: "sectionHeader" },
      {
        text:
          "Nome do Paciente: " +
          report.identificacao.nome +
          "\nData de Nascimento: " +
          new Date(report.identificacao.dataNascimento).toLocaleDateString("pt-BR") +
          "\nIdade: " +
          report.identificacao.idade +
          "\nEscolaridade: " +
          report.identificacao.escolaridade +
          "\nEscola: " +
          report.identificacao.escola +
          "\nDominância Manual: " +
          report.identificacao.dominanciaManual +
          "\nPai: " +
          report.identificacao.pai +
          "\nMãe: " +
          report.identificacao.mae +
          "\nFaz uso de medicamento: " +
          report.identificacao.medicamento,
        style: "content",
        margin: [20, 0, 0, 10] as [number, number, number, number],
      },
      { text: "II - QUEIXA", style: "sectionHeader" },
      { text: report.queixa, style: "content", margin: [20, 0, 0, 10] },
      { text: "III - HISTÓRICO DO DESENVOLVIMENTO E DA SAÚDE", style: "sectionHeader" },
      { text: report.historico, style: "content", margin: [20, 0, 0, 10] },
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
      { text: "V - COMPORTAMENTO DO APRENDIZANTE DURANTE A AVALIAÇÃO", style: "sectionHeader" },
      { text: report.comportamento, style: "content", margin: [20, 0, 0, 10] },
      { text: "VI - AVALIAÇÃO", style: "sectionHeader" },
      {
        text: "VI.1 - Instrumentos:",
        style: "subSectionHeader",
        margin: [0, 10, 0, 5] as [number, number, number, number],
      },
      {
        text: report.avaliacaoInstrumentos,
        style: "content",
        margin: [20, 0, 0, 10],
      },
      {
        text: "VI.2 - Síntese dos resultados:",
        style: "subSectionHeader",
        margin: [0, 10, 0, 5] as [number, number, number, number],
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
    footer: function (currentPage, pageCount) {
      return {
        text: `Data: ${new Date(report.createdAt).toLocaleDateString(
          "pt-BR"
        )} - p. ${currentPage}/${pageCount}`,
        alignment: "center",
        margin: [0, 10, 0, 0] as [number, number, number, number],
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
        margin: [0, 10, 0, 5] as [number, number, number, number],
      },
      subSectionHeader: {
        fontSize: 12,
        bold: true,
        margin: [20, 5, 0, 5] as [number, number, number, number],
      },
      content: {
        fontSize: 12,
        alignment: "justify",
      },
    },
    defaultStyle: {},
  };

  pdfMake.createPdf(docDefinition).download(`relatorio-${report._id}.pdf`);
};
