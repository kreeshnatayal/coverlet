// fileParser.js — Browser-side resume file parsing
// Supports PDF, DOCX, and plain TXT

// ─── PDF ─────────────────────────────────────────────────────────
async function parsePdf(file) {
  const pdfjsLib = await import('pdfjs-dist');

  // Use CDN-hosted worker to avoid Vite static analysis issues with dynamic imports
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText.trim();
}

// ─── DOCX ────────────────────────────────────────────────────────
async function parseDocx(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

// ─── TXT ─────────────────────────────────────────────────────────
function parseTxt(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result.trim());
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

// ─── MAIN ENTRY ──────────────────────────────────────────────────
export async function parseResumeFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'pdf') return parsePdf(file);
  if (ext === 'docx') return parseDocx(file);
  if (ext === 'txt') return parseTxt(file);

  throw new Error(`Unsupported file type ".${ext}". Please upload a PDF, DOCX, or TXT file.`);
}

export const ACCEPTED_TYPES = '.pdf,.docx,.txt';
export const MAX_FILE_SIZE_MB = 10;
