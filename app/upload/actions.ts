"use server";

import crypto from "node:crypto";
import { processStatementPipeline } from "@/server/pipeline/processStatementPipeline";

export interface UploadActionResult {
  success: boolean;
  requiresPassword?: boolean;
  error?: string;
  data?: {
    jobId: string;
    pageCount: number;
  };
}

export async function processUpload(formData: FormData): Promise<UploadActionResult> {
  const file = formData.get("file") as File | null;
  const password = (formData.get("password") as string | null) ?? "";

  if (!file) {
    return { success: false, error: "No file uploaded" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  /**
   * We generate the job id here (UI layer responsibility)
   */
  const jobId = crypto.randomUUID();

  try {
    const result = await processStatementPipeline({
      id: jobId,
      fileBuffer: buffer,
      password,
      originalName: file.name,
    });

    return {
      success: true,
      data: {
        jobId: result.jobId,
        pageCount: result.pageCount,
      },
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown processing error";

    /**
     * Detect password failure coming from qpdf
     */
    if (message.includes("password") || message.includes("decrypt")) {
      return {
        success: false,
        requiresPassword: true,
        error: "This PDF requires a valid password",
      };
    }

    return { success: false, error: message };
  }
}
