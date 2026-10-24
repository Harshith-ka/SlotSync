import { processHoldExpirations } from './hold-expiry.worker';
import { processOutboxEvents } from './outbox.worker';
import { processCalendarSync } from './calendar-sync.worker';

let isRunning = true;

async function runWorkerLoop() {
  console.log('⚡ [SlotSync Worker Service] Running background job cycles...');

  while (isRunning) {
    try {
      // 1. Process expired reservation holds (every cycle)
      await processHoldExpirations();

      // 2. Process outbox event queue
      await processOutboxEvents();

      // 3. Calendar reconciliation
      await processCalendarSync();
    } catch (err: any) {
      console.error('[SlotSync Worker] Uncaught cycle error:', err.message);
    }

    // Sleep for 3 seconds before next iteration
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  console.log('🛑 [SlotSync Worker] Gracefully stopped.');
}

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down worker...');
  isRunning = false;
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down worker...');
  isRunning = false;
});

runWorkerLoop();
