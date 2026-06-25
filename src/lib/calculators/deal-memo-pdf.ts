import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { CalculatorId } from "@/lib/calculators/types";

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [""];
  const words = clean.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildDealMemoPdf(input: {
  calculatorName: string;
  calculatorId: CalculatorId;
  memberName?: string;
  tierName?: string;
  inputs: Record<string, string | number>;
  outputs: Record<string, string | number>;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([612, 792]);
  const { width, height } = page.getSize();
  const margin = 48;
  let y = height - margin;

  page.drawText("ListQik Institutional Deal Memo", {
    x: margin,
    y,
    size: 18,
    font: fontBold,
    color: rgb(0.05, 0.45, 0.25),
  });
  y -= 24;

  page.drawText(input.calculatorName, { x: margin, y, size: 12, font: fontBold });
  y -= 16;
  if (input.memberName) {
    page.drawText(`Prepared for: ${input.memberName}`, { x: margin, y, size: 10, font });
    y -= 14;
  }
  if (input.tierName) {
    page.drawText(`Velocity Club: ${input.tierName}`, { x: margin, y, size: 10, font });
    y -= 20;
  }

  const drawSection = (title: string, rows: Record<string, string | number>) => {
    page.drawText(title, { x: margin, y, size: 11, font: fontBold });
    y -= 16;
    for (const [key, value] of Object.entries(rows)) {
      const line = `${key}: ${value}`;
      for (const wrapped of wrapText(line, font, 9, width - margin * 2)) {
        if (y < margin + 40) return;
        page.drawText(wrapped, { x: margin, y, size: 9, font });
        y -= 12;
      }
    }
    y -= 8;
  };

  drawSection("Inputs", input.inputs);
  drawSection("Outputs", input.outputs);

  y = Math.max(y, margin + 60);
  const disclaimer =
    "For investor analysis only. Not financial, legal, or tax advice. ListQik fee assumptions use Subsonic ($79 + 0.5% at closing) vs traditional 3% listing commission.";
  for (const line of wrapText(disclaimer, font, 8, width - margin * 2)) {
    page.drawText(line, { x: margin, y, size: 8, font, color: rgb(0.35, 0.35, 0.35) });
    y -= 10;
  }

  return doc.save();
}
