import { performance } from 'perf_hooks';

const url = process.env.TEST_URL || 'http://localhost:3100/';
const total = Number(process.env.TEST_TOTAL || '1000');
const concurrency = Number(process.env.TEST_CONCURRENCY || '200');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let completed = 0;
let failures = 0;
const latencies = [];

async function runBatch(batchSize) {
  const promises = [];
  for (let i = 0; i < batchSize; i += 1) {
    promises.push((async () => {
      const start = performance.now();
      try {
        const res = await fetch(url, { method: 'GET' });
        const body = await res.text();
        const duration = performance.now() - start;
        if (res.status !== 200 || !body) {
          failures += 1;
        } else {
          latencies.push(duration);
        }
      } catch {
        failures += 1;
      } finally {
        completed += 1;
      }
    })());
  }

  await Promise.all(promises);
}

(async () => {
  console.log(`Load test: ${total} requests, ${concurrency} concurrency, url=${url}`);
  for (let cursor = 0; cursor < total; cursor += concurrency) {
    const batchSize = Math.min(concurrency, total - cursor);
    await runBatch(batchSize);
    process.stdout.write(`Completed ${completed}/${total}...\r`);
    await delay(50);
  }

  const success = total - failures;
  const average = latencies.reduce((sum, value) => sum + value, 0) / latencies.length || 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;

  console.log('\n--- Load Test Results ---');
  console.log(`Total requests: ${total}`);
  console.log(`Successes: ${success}`);
  console.log(`Failures: ${failures}`);
  console.log(`Average latency: ${average.toFixed(1)} ms`);
  console.log(`95th percentile latency: ${p95.toFixed(1)} ms`);
})();
