import { PDFDocument, StandardFonts, rgb, PDFFont } from "pdf-lib";

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
  const indent = 20; // indent para o conteúdo (tabulação)

  // Cria a primeira página e define a posição inicial
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let y = height - margin;
  const maxWidth = width - 2 * margin;

  // --- Header: desenha o header centralizado ---
  const headerText = "RELATÓRIO DE AVALIAÇÃO NEUROPSICOPEDAGÓGICA (RAN)";
  const headerFontSize = 18;
  const headerWidth = fontBold.widthOfTextAtSize(headerText, headerFontSize);
  const headerX = (width - headerWidth) / 2; // centraliza horizontalmente
  page.drawText(headerText, {
    x: headerX,
    y: y,
    size: headerFontSize,
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

  // --- Constrói o texto completo do relatório ---
  // Cada elemento do array é um parágrafo (título ou conteúdo)
  const fullReportArray = [
    report.title.toUpperCase(),
    "I - IDENTIFICAÇÃO",
    report.identificacao,
    "II - QUEIXA",
    report.queixa,
    "III - HISTÓRICO DO DESENVOLVIMENTO E DA SAÚDE",
    report.historico,
    report.subtituloHistorico ? `III.1 - ${report.subtituloHistorico}` : "",
    "IV - VIDA ESCOLAR",
    report.vidaEscolar,
    "V - COMPORTAMENTO DO APRENDIZANTE DURANTE A AVALIAÇÃO",
    report.comportamento,
    "VI - AVALIAÇÃO",
    "VI.1 - Instrumentos:",
    report.avaliacaoInstrumentos,
    "VI.2 - Síntese dos resultados:",
    report.avaliacaoSintese,
    "VII - CONCLUSÃO",
    report.conclusao,
    "Fechamento:",
    report.fechamento,
    "Local e Data:",
    report.localData,
    "Assinatura:",
    report.assinatura,
  ];
  // Junta com duas quebras de linha para separar os parágrafos
  const fullReportText = fullReportArray.join("\n\n");

  // --- Função auxiliar para quebrar um texto em linhas de acordo com o maxWidth ---
  const wrapText = (text: string, fontUsed: PDFFont, size: number): string[] => {
    // Remove quebras de linha, tabulações e alguns caracteres que não são suportados
    text = text.replace(/[\n\t✔●]/g, " ");
    const words = text.split(" ").filter((w) => w !== "");
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
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // --- Função auxiliar para desenhar uma linha justificada ---
  // Essa função divide a linha em palavras e distribui o espaço extra entre elas
  const drawJustifiedLine = (
    line: string,
    startX: number,
    yPos: number,
    fontUsed: PDFFont,
    size: number
  ) => {
    const words = line.split(" ");
    if (words.length === 1) {
      page.drawText(line, { x: startX, y: yPos, size, font: fontUsed, color: rgb(0, 0, 0) });
      return;
    }
    const lineTextWidth = fontUsed.widthOfTextAtSize(line, size);
    const totalExtraSpace = maxWidth - lineTextWidth;
    const extraSpacePerGap = totalExtraSpace / (words.length - 1);
    let currentX = startX;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      page.drawText(word, { x: currentX, y: yPos, size, font: fontUsed, color: rgb(0, 0, 0) });
      const wordWidth = fontUsed.widthOfTextAtSize(word, size);
      currentX += wordWidth;
      if (i < words.length - 1) {
        currentX += extraSpacePerGap;
      }
    }
  };

  // --- Processa e desenha os parágrafos ---
  // Divide o texto completo em parágrafos (usando duas quebras de linha como separador)
  const paragraphs = fullReportText.split(/\n\s*\n/);
  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    if (!trimmedPara) continue;

    // Heurística: se o parágrafo estiver todo em caixa alta e for curto, trata-se de um título
    const isHeading = trimmedPara === trimmedPara.toUpperCase() && trimmedPara.length < 100;
    const currentFont = isHeading ? fontBold : font;
    const currentFontSize = isHeading ? headingFontSize : fontSize;
    const currentLineHeight = isHeading ? headingLineHeight : lineHeight;

    // Quebra o parágrafo em linhas
    const lines = wrapText(trimmedPara, currentFont, currentFontSize);

    // Para parágrafos de conteúdo (não-heading), aplica um indent na primeira linha
    const firstLineX = isHeading ? margin : margin + indent;

    // Desenha cada linha do parágrafo
    for (let i = 0; i < lines.length; i++) {
      // Se não for o último linha de um parágrafo de conteúdo, tenta justificar o texto
      if (!isHeading && i < lines.length - 1) {
        // Para a primeira linha, usa o indent; para as demais, usa a margem padrão
        const lineX = i === 0 ? firstLineX : margin;
        drawJustifiedLine(lines[i], lineX, y, currentFont, currentFontSize);
      } else {
        // Última linha ou parágrafo de título: alinha à esquerda
        const lineX = i === 0 && !isHeading ? firstLineX : margin;
        page.drawText(lines[i], {
          x: lineX,
          y: y,
          size: currentFontSize,
          font: currentFont,
          color: rgb(0, 0, 0),
        });
      }
      y -= currentLineHeight;
      // Se o espaço acabar, adiciona nova página
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

  // --- Finaliza e dispara o download ---
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `relatorio-${report._id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
