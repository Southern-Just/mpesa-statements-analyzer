import { processStatementPipeline } from "../pipeline/processStatementPipeline";

class InMemoryQueue {
  private jobs: unknown[] = [];
  private running = false;

  async add(job: unknown): Promise<void> {
    this.jobs.push(job);
    this.run();
  }

  private async run(): Promise<void> {
    if (this.running) return;
    this.running = true;

    while (this.jobs.length > 0) {
      const job = this.jobs.shift();
      if (!job) continue;

      await processStatementPipeline(job as never);
    }

    this.running = false;
  }
}

export const jobQueue = new InMemoryQueue();
