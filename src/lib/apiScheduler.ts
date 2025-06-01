export class ApiRequestScheduler {
  private queue: (() => Promise<void>)[] = [];
  private activeCount = 0;
  private maxConcurrent: number;
  private minTime: number;
  private lastExecutionTime = 0;

  constructor(maxConcurrent: number = 5, minTime: number = 300) {
    this.maxConcurrent = maxConcurrent;
    this.minTime = minTime;
  }

  async schedule<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const job = async () => {
        this.activeCount++;
        const timeSinceLast = Date.now() - this.lastExecutionTime;
        const delay = Math.max(this.minTime - timeSinceLast, 0);

        setTimeout(async () => {
          this.lastExecutionTime = Date.now();
          try {
            const result = await request();
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            this.activeCount--;
            this.runNext(); // Process next job
          }
        }, delay);
      };

      this.queue.push(job);
      this.runNext();
    });
  }

  private runNext(): void {
    if (this.activeCount < this.maxConcurrent && this.queue.length > 0) {
      const nextJob = this.queue.shift();
      if (nextJob) nextJob();
    }
  }

  clearQueue(): void {
    this.queue = [];
    console.log("✅ All queued requests have been removed.");
  }
}
