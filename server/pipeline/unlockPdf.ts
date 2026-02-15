import { execa } from "execa";
import { promises as fs } from "node:fs";

export interface UnlockPdfParams {
  /**
   * Absolute path to the encrypted PDF.
   */
  inputPath: string;

  /**
   * Destination path for the decrypted PDF.
   */
  outputPath: string;

  /**
   * User-supplied password.
   */
  password: string;
}

export interface UnlockPdfResult {
  unlockedPath: string;
  fileSize: number;
}

/**
 * Decrypts a password-protected PDF using qpdf.
 * Does NOT modify the original file.
 */
export async function unlockPdf(
  params: UnlockPdfParams
): Promise<UnlockPdfResult> {
  if (!params.password) {
    throw new Error("PDF password is required");
  }

  try {
    await execa("qpdf", [
      `--password=${params.password}`,
      "--decrypt",
      params.inputPath,
      params.outputPath,
    ]);
  } catch (error) {
    throw new Error("Failed to decrypt PDF. Invalid password or corrupted file.");
  }

  // Verify output exists and is readable
  const stat = await fs.stat(params.outputPath);

  if (!stat.isFile() || stat.size === 0) {
    throw new Error("Decryption produced an invalid file.");
  }

  return {
    unlockedPath: params.outputPath,
    fileSize: stat.size,
  };
}
