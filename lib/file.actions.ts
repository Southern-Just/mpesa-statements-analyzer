"use server";

import { ProcessedData, Transaction } from "@/types";
import { promises as fs } from "fs";
import path from "path";

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

function sortByName(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const grouped: Record<string, Transaction[]> = {};

  for (const tx of transactions) {
    if (!grouped[tx.name]) grouped[tx.name] = [];
    grouped[tx.name].push(tx);
  }

  const sorted: Record<string, Transaction[]> = {};

  for (const name of Object.keys(grouped).sort()) {
    sorted[name] = grouped[name].sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  return sorted;
}

export async function processFile(
  formData: FormData
): Promise<{ success: boolean; data?: ProcessedData; error?: string }> {
  let filePath = "";

  try {
    const file = formData.get("file") as File | null;

    if (!file) return { success: false, error: "No file provided" };
    if (file.type !== ALLOWED_TYPE)
      return { success: false, error: "Invalid file type" };
    if (file.size > MAX_FILE_SIZE)
      return { success: false, error: "File too large" };

    const uploadDir = path.join(process.cwd(), "tmp", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    filePath = path.join(
      uploadDir,
      `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
    );

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // ✅ Turbopack-safe dynamic import
    const pdf = (await import("pdf-parse")).default;
    const result = await pdf(buffer);
    const extractedText = result.text;

    const transactions = extractTransactions(extractedText);
    const sortedByName = sortByName(transactions);

    await fs.unlink(filePath).catch(() => {});

    return {
      success: true,
      data: { sortedByName, rawText: extractedText },
    };
  } catch (error: unknown) {
    if (filePath) await fs.unlink(filePath).catch(() => {});

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process PDF",
    };
  }
}

// "use server";

// import { ProcessedData, Transaction } from "@/types";
// import { promises as fs } from "fs";
// import path from "path";
// import pdf from "pdf-parse";

// const MAX_FILE_SIZE = 10 * 1024 * 1024;
// const ALLOWED_TYPE = "application/pdf";

// function extractTransactions(text: string): Transaction[] {
//   const transactions: Transaction[] = [];
//   const regex =
//     /(\d{4}-\d{2}-\d{2})\s*-\s*KES\s(\d+\.?\d*)\sto\s([A-Za-z\s]+)\s*-\s*(.*)/g;

//   let match: RegExpExecArray | null;

//   while ((match = regex.exec(text)) !== null) {
//     transactions.push({
//       date: match[1],
//       amount: Number(match[2]),
//       name: match[3].trim(),
//       description: match[4].trim(),
//     });
//   }

//   return transactions;
// }

// function sortByName(
//   transactions: Transaction[]
// ): Record<string, Transaction[]> {
//   const grouped: Record<string, Transaction[]> = {};

//   for (const tx of transactions) {
//     if (!grouped[tx.name]) grouped[tx.name] = [];
//     grouped[tx.name].push(tx);
//   }

//   const sorted: Record<string, Transaction[]> = {};

//   for (const name of Object.keys(grouped).sort()) {
//     sorted[name] = grouped[name].sort(
//       (a, b) =>
//         new Date(a.date).getTime() - new Date(b.date).getTime()
//     );
//   }

//   return sorted;
// }

// export async function processFile(
//   formData: FormData
// ): Promise<{ success: boolean; data?: ProcessedData; error?: string }> {
//   let filePath = "";

//   try {
//     const file = formData.get("file") as File | null;

//     if (!file) return { success: false, error: "No file provided" };
//     if (file.type !== ALLOWED_TYPE)
//       return { success: false, error: "Invalid file type" };
//     if (file.size > MAX_FILE_SIZE)
//       return { success: false, error: "File too large" };

//     const uploadDir = path.join(process.cwd(), "tmp", "uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     filePath = path.join(
//       uploadDir,
//       `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
//     );

//     const buffer = Buffer.from(await file.arrayBuffer());
//     await fs.writeFile(filePath, buffer);

//     // ✅ Correct usage
//     const result = await pdf(buffer);
//     const extractedText = result.text;

//     const transactions = extractTransactions(extractedText);
//     const sortedByName = sortByName(transactions);

//     await fs.unlink(filePath).catch(() => {});

//     return {
//       success: true,
//       data: { sortedByName, rawText: extractedText },
//     };
//   } catch (error: unknown) {
//     if (filePath) await fs.unlink(filePath).catch(() => {});

//     console.error("PDF processing failed:", error);

//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "Failed to process PDF",
//     };
//   }
// }
