import { ChildProcess, spawn } from 'node:child_process';
import { onInterrupt } from './run-control/interrupt';

const STOP_GRACE_MS = 5_000;

export interface CommandOptions {
  cwd: string;
  env?: Record<string, string>;
}

function buildChildEnv(options: CommandOptions): NodeJS.ProcessEnv {
  return { ...process.env, ...options.env };
}

function terminateChild(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    const force = setTimeout(() => child.kill('SIGKILL'), STOP_GRACE_MS);
    child.once('exit', () => {
      clearTimeout(force);
      resolve();
    });
    child.kill('SIGTERM');
  });
}

/**
 * Stops `child` if the run is interrupted while it runs. Ctrl-C reaches it
 * directly, but a SIGTERM sent to pnpm alone does not.
 */
function stopOnInterrupt(child: ChildProcess): void {
  const unregister = onInterrupt(() => terminateChild(child));
  child.once('exit', unregister);
}

/** Runs a command with inherited stdio; resolves with its exit code. */
export function runCommandForExitCode(
  command: string,
  args: readonly string[],
  options: CommandOptions,
): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: buildChildEnv(options),
      stdio: 'inherit',
    });
    stopOnInterrupt(child);
    child.on('error', reject);
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

/** Runs a command and fails fast when it exits non-zero. */
export async function runCommand(
  command: string,
  args: readonly string[],
  options: CommandOptions,
): Promise<void> {
  const code = await runCommandForExitCode(command, args, options);
  if (code !== 0) {
    throw new Error(`"${command} ${args.join(' ')}" exited with code ${code}`);
  }
}

/** Runs a command and returns its trimmed stdout. */
export function captureCommand(
  command: string,
  args: readonly string[],
  options: CommandOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: buildChildEnv(options),
    });
    stopOnInterrupt(child);
    let output = '';
    child.stdout.on('data', (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve(output.trim()) : reject(new Error(`${command} exited ${code}`)),
    );
  });
}
