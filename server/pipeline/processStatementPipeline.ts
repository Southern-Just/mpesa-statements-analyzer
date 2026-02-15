import { createTempWorkspace } from "../temp-files/tempFileManager";
import { unlockPdf } from "./unlockPdf";
import { rasterizePdf } from "./rasterizePdf";
import { promises as fs } from "node:fs";

export interface StatementProcessingJob {
  id: string;
  fileBuffer: Buffer;
  password: string;
  originalName: string;
}

export interface StatementProcessingResult {
  jobId: string;
  pageCount: number;
  workspaceUsed: string;
}

export async function processStatementPipeline(
  job: StatementProcessingJob
): Promise<StatementProcessingResult> {
  const workspace = await createTempWorkspace();

  try {
    console.log(`[${job.id}] Workspace created at ${workspace.root}`);

    /**
     * STEP 1 — Persist uploaded file
     */
    const inputPdfPath = await workspace.writeFile("input.pdf", job.fileBuffer);

    /**
     * STEP 2 — Unlock password-protected PDF
     */
    const unlockedPdfPath = workspace.resolvePath("unlocked.pdf");

    await unlockPdf({
      inputPath: inputPdfPath,
      outputPath: unlockedPdfPath,
      password: job.password,
    });

    console.log(`[${job.id}] PDF decrypted`);

    /**
     * STEP 3 — Rasterize into images
     */
    const { pages } = await rasterizePdf({
      pdfPath: unlockedPdfPath,
      outputDir: workspace.root,
      dpi: 300,
    });

    console.log(`[${job.id}] Rasterized ${pages.length} pages`);

    /**
     * (NEXT STAGES WILL PLUG IN HERE)
     * normalize → OCR → layout → extraction → validation
     */

    return {
      jobId: job.id,
      pageCount: pages.length,
      workspaceUsed: workspace.root,
    };
  } catch (error) {
    console.error(`[${job.id}] Pipeline failed`, error);
    throw error;
  } finally {
    /**
     * Always cleanup — even if OCR crashes later.
     */
    await workspace.cleanup();
    console.log(`[${job.id}] Workspace cleaned`);
  }
}
