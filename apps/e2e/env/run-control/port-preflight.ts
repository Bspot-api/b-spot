/**
 * Fails fast when an e2e port is already taken, before any service starts:
 * a service's readiness check would otherwise take a leftover process (from a
 * run killed with SIGKILL) for the new one. It names the holder; it never
 * kills anything.
 */
import { execFile } from 'node:child_process';
import net from 'node:net';
import { promisify } from 'node:util';

const LOOPBACK_HOSTS = ['127.0.0.1', '::1'] as const;
const CONNECT_TIMEOUT_MS = 1_000;

function isAnswering(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host });
    const settle = (isOpen: boolean): void => {
      socket.destroy();
      resolve(isOpen);
    };
    socket.setTimeout(CONNECT_TIMEOUT_MS, () => settle(false));
    socket.once('connect', () => settle(true));
    socket.once('error', () => settle(false));
  });
}

async function isPortBusy(port: number): Promise<boolean> {
  const answers = await Promise.all(LOOPBACK_HOSTS.map((host) => isAnswering(port, host)));
  return answers.includes(true);
}

/** `pid 123 (node)` from lsof, or a hint when lsof cannot tell. */
async function describeListener(port: number): Promise<string> {
  try {
    const args = ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-Fpc'];
    const { stdout } = await promisify(execFile)('lsof', args);
    const pid = /^p(\d+)$/m.exec(stdout)?.[1];
    const command = /^c(.+)$/m.exec(stdout)?.[1];
    if (pid) return `pid ${pid}${command ? ` (${command})` : ''}`;
  } catch {
    // lsof is missing or found nothing: fall through.
  }
  return `an unknown process (try: lsof -nP -iTCP:${port} -sTCP:LISTEN)`;
}

/** Throws, naming each busy port and its holder, when any of `ports` is already in use. */
export async function assertPortsFree(ports: readonly number[]): Promise<void> {
  const busyPorts: number[] = [];
  for (const port of ports) if (await isPortBusy(port)) busyPorts.push(port);
  if (busyPorts.length === 0) return;
  const holders = await Promise.all(
    busyPorts.map(async (port) => `port ${port} is held by ${await describeListener(port)}`),
  );
  throw new Error(
    `[e2e] e2e ports already in use: ${holders.join('; ')}. ` +
      'A killed run may have left them behind; stop those processes and run again.',
  );
}
