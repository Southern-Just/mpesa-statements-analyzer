import { execa } from "execa";
import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface RasterizePdfParams {
  /**
   * Absolute path to unlocked PDF.
   */
  pdfPath: string;

  /**
   * Workspace directory to emit images into.
   */
  outputDir: string;

  /**
   * DPI resolution (default 300).
   */
  dpi?: number;
}

export interface RasterizedPage {
  pageNumber: number;
  imagePath: string;
}

export interface RasterizePdfResult {
  pages: RasterizedPage[];
}

/**
 * Converts a PDF into high-resolution PNG images using pdftoppm.
 */
export async function rasterizePdf(
  params: RasterizePdfParams
): Promise<RasterizePdfResult> {
  const dpi = params.dpi ?? 300;

  const outputPrefix = join(params.outputDir, "page");

  await execa("pdftoppm", [
    "-png",
    "-gray",           // Force grayscale
    "-r",
    String(dpi),
    params.pdfPath,
    outputPrefix,
  ]);

  // Collect generated images
  const files = await fs.readdir(params.outputDir);

  const pageFiles = files
    .filter((file) => file.startsWith("page-") && file.endsWith(".png"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const pages: RasterizedPage[] = pageFiles.map((file, index) => ({
    pageNumber: index + 1,
    imagePath: join(params.outputDir, file),
  }));

  if (pages.length === 0) {
    throw new Error("Rasterization failed: no images generated.");
  }

  return { pages };
}
