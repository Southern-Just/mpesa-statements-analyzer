"use server";

import { ProcessedData, Transaction } from "@/types";
import * as pdfjsLib from "pdfjs-dist";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPE = "application/pdf";

function extractTransactions(text: string): Transaction[] {
  const transactions: Transaction[] = [];
  const regex =
    /(\d{4}-\d{2}-\d{2})\s*-\s*KES\s(\d+\.?\d*)\sto\s([A-Za-z\s]+)\s*-\s*(.*)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    transactions.push({
      date: match[1],
      amount: Number(match[2]),
      name: match[3].trim(),
      description: match[4].trim(),
    });
  }
  return transactions;
}

function sortByName(transactions: Transaction[]): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};
  for (const tx of transactions) {
    if (!grouped[tx.name]) grouped[tx.name] = [];
    grouped[tx.name].push(tx);
  }
  const sorted: Record<string, Transaction[]> = {};
  for (const name of Object.keys(grouped).sort()) {
    sorted[name] = grouped[name].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
  return sorted;
}

async function extractTextFromPDF(buffer: Buffer, password?: string): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
    data: buffer,
    password,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

export async function processFile(
  formData: FormData
): Promise<{ success: boolean; data?: ProcessedData; error?: string; isPasswordProtected?: boolean }> {
  try {
    const file = formData.get("file");
    const password = formData.get("password") as string | undefined;

    if (!(file instanceof File)) return { success: false, error: "No file provided" };
    if (file.type !== ALLOWED_TYPE) return { success: false, error: "Invalid file type" };
    if (file.size > MAX_FILE_SIZE) return { success: false, error: "File too large" };

    const buffer = Buffer.from(await file.arrayBuffer());

    try {
      const extractedText = await extractTextFromPDF(buffer, password);
      const transactions = extractTransactions(extractedText);
      const sortedByName = sortByName(transactions);
      return { success: true, data: { sortedByName, rawText: extractedText } };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "PasswordException") {
        return { success: false, isPasswordProtected: true, error: "PDF is password protected" };
      }
      throw err;
    }
  } catch (error: unknown) {
    console.error("PDF processing failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process PDF",
    };
  }
}
