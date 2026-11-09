import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

// Called only by process entry points, never by importing/creating the app.
// Node preserves explicitly supplied environment variables. No values are logged.
export function loadLocalEnvironment(): void {
  try {
    loadEnvFile(fileURLToPath(new URL('../../../.env', import.meta.url)));
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') return;
    throw new Error('Local environment could not be loaded.');
  }
}
