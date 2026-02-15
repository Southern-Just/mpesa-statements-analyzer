import { promises as fs } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";

export interface TempWorkspace {
  jobId: string;
  root: string;
  resolvePath: (filename: string) => string;
  writeFile: (filename: string, data: Buffer) => Promise<string>;
  cleanup: () => Promise<void>;
}
// 
export async function createTempWorkspace(): Promise<TempWorkspace> {
  const jobId = `mpesa-${randomUUID()}`;
  const root = join(tmpdir(), jobId);

  await fs.mkdir(root, { recursive: true });

  function resolvePath(filename: string): string {
    const safePath = resolve(root, filename);

    if (!safePath.startsWith(root)) {
      throw new Error("Unsafe path detected");
    }

    return safePath;
  }

  async function writeFile(filename: string, data: Buffer): Promise<string> {
    const filePath = resolvePath(filename);
    await fs.writeFile(filePath, data);
    return filePath;
  }

  async function cleanup(): Promise<void> {
    // rm recursive
    await fs.rm(root, {
      recursive: true,
      force: true,
    });
  }

  return {
    jobId,
    root,
    resolvePath,
    writeFile,
    cleanup,
  };
}
