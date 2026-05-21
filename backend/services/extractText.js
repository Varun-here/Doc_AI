const fs = require("fs");
const mammoth = require("mammoth");

async function parsePdfBuffer(dataBuffer) {
  try {
    const pdfParseModule = require("pdf-parse");
    const pdfParse = pdfParseModule.default || pdfParseModule;

    if (typeof pdfParse === "function") {
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text || "";
    }

    if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: dataBuffer });
      const result = await parser.getText();

      if (parser.destroy) {
        await parser.destroy();
      }

      return result.text || "";
    }
  } catch (error) {
    console.error("PDF parser error:", error);
  }

  throw new Error(
    "PDF text extraction failed. Please upload a text-based PDF, DOCX, or TXT file.",
  );
}

async function extractTextFromFile(file) {
  const filePath = file.path;
  const mimeType = file.mimetype;

  if (mimeType === "application/pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const text = await parsePdfBuffer(dataBuffer);
    return cleanText(text);
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ path: filePath });
    return cleanText(result.value);
  }

  if (mimeType === "text/plain") {
    const text = fs.readFileSync(filePath, "utf-8");
    return cleanText(text);
  }

  throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT.");
}

function cleanText(text) {
  if (!text) return "";

  return text
    .replace(/\r/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

module.exports = { extractTextFromFile };
