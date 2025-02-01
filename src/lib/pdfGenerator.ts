import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

// Tipo atualizado para refletir as diversas seções do relatório
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
  // Cria o documento PDF e incorpora as fontes padrão
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Configurações gerais de layout
  const fontSize = 12;
  const headingFontSize = 16;
  const lineHeight = fontSize * 1.2;
  const headingLineHeight = headingFontSize * 1.4;
  const margin = 50;

  // Cria a primeira página e define a posição inicial
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let y = height - margin;
  const maxWidth = width - 2 * margin;

  // Cabeçalho principal (fixo ou padrão)
  const headerText = "RELATÓRIO DE AVALIAÇÃO NEUROPSICOPEDAGÓGICA (RAN)";
  page.drawText(headerText, {
    x: margin,
    y: y,
    size: 18,
    font: fontBold,
    color: rgb(0, 0, 0.8),
  });
  y -= 30;

  // Exibe a data (utilizando report.createdAt)
  const dateLine = `Data: ${new Date(report.createdAt).toLocaleDateString("pt-BR")}`;
  page.drawText(dateLine, {
    x: margin,
    y: y,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 40;

  // Constrói o texto completo do relatório unindo os diversos campos
  const fullReportText = `
${report.title.toUpperCase()}

I - IDENTIFICAÇÃO
${report.identificacao}

II - QUEIXA
${report.queixa}

III - HISTÓRICO DO DESENVOLVIMENTO E DA SAÚDE
${report.historico}

${report.subtituloHistorico ? `III.1 - ${report.subtituloHistorico}` : ""}

IV - VIDA ESCOLAR
${report.vidaEscolar}

V - COMPORTAMENTO DO APRENDIZANTE DURANTE A AVALIAÇÃO
${report.comportamento}

VI - AVALIAÇÃO
VI.1 - Instrumentos:
${report.avaliacaoInstrumentos}

VI.2 - Síntese dos resultados:
${report.avaliacaoSintese}

VII - CONCLUSÃO
${report.conclusao}

Fechamento:
${report.fechamento}

Local e Data:
${report.localData}

Assinatura:
${report.assinatura}
`;

// Função auxiliar para quebrar um texto em linhas de acordo com o maxWidth
const wrapText = (text: string, fontUsed: PDFFont, size: number): string[] => {
  // Remove quebras de linha, tabulações, e os caracteres "✔" e "●"
  text = text.replace(/[\n\t✔●]/g, " ");
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testLineWidth = fontUsed.widthOfTextAtSize(testLine, size);
    if (testLineWidth < maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      // Se a palavra sozinha ultrapassar o maxWidth, ela ficará em uma linha separada
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
};

  // Divide o texto completo em parágrafos (usando duplo \n como separador)
  const paragraphs = fullReportText.split(/\n\s*\n/);

  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // Heurística para detectar se o parágrafo é um cabeçalho:
    // Se estiver em caixa alta e for curto, utiliza fonte em negrito e tamanho maior
    const isHeading =
      trimmedPara === trimmedPara.toUpperCase() && trimmedPara.length < 100;
    const currentFont = isHeading ? fontBold : font;
    const currentFontSize = isHeading ? headingFontSize : fontSize;
    const currentLineHeight = isHeading ? headingLineHeight : lineHeight;

    // Quebra o parágrafo em linhas
    const lines = wrapText(trimmedPara, currentFont, currentFontSize);

    // Se o conteúdo ultrapassar o espaço disponível, adiciona nova página
    if (y - lines.length * currentLineHeight < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }

    // Desenha cada linha do parágrafo
    for (const line of lines) {
      page.drawText(line, {
        x: margin,
        y: y,
        size: currentFontSize,
        font: currentFont,
        color: rgb(0, 0, 0),
      });
      y -= currentLineHeight;
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
    }
    // Espaço extra entre parágrafos
    y -= currentLineHeight;
    if (y < margin) {
      page = pdfDoc.addPage();
      y = height - margin;
    }
  }

  // Salva o documento e dispara o download
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `relatorio-${report._id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
