import { MAILDEV_WEB_PORT, REPO_ROOT, SMTP_PORT } from './e2e-env';
import { captureCommand, runCommand } from './process';
import { listMailDevMessages } from '../support/maildev';
import { sleep } from '../support/wait';

const SERVICES = ['postgres', 'maildev'] as const;
const MAILDEV_WEB_CONTAINER_PORT = '1080';
const MAILDEV_SMTP_CONTAINER_PORT = '1025';
const WAIT_STEP_MS = 500;
const WAIT_LIMIT_MS = 60_000;

/** Host ports for b-spot's MailDev when the e2e run starts it (compose variables). */
const MAILDEV_PORT_ENV = { SMTP_PORT: String(SMTP_PORT), SMTP_PORT_WEB: String(MAILDEV_WEB_PORT) };

/**
 * Pinned compose project name: a run from a git worktree (whose folder is not
 * `b-spot`) attaches to the running b-spot containers instead of clashing.
 */
const COMPOSE_PROJECT = ['-p', 'b-spot'] as const;

function runCompose(args: readonly string[]): Promise<void> {
  return runCommand('docker', ['compose', ...COMPOSE_PROJECT, ...args], {
    cwd: REPO_ROOT,
    env: MAILDEV_PORT_ENV,
  });
}

function captureCompose(args: readonly string[]): Promise<string> {
  return captureCommand('docker', ['compose', ...COMPOSE_PROJECT, ...args], { cwd: REPO_ROOT });
}

async function listRunningServices(): Promise<string[]> {
  const output = await captureCompose(['ps', '--status', 'running', '--services']);
  return output.split('\n').filter(Boolean);
}

async function readHostPort(service: string, containerPort: string): Promise<string> {
  const binding = await captureCompose(['port', service, containerPort]);
  return binding.split(':').pop() ?? '';
}

/** Points this process (and its children) at an already-running MailDev's ports. */
async function adoptRunningMailDev(): Promise<void> {
  process.env.E2E_MAILDEV_WEB_PORT = await readHostPort('maildev', MAILDEV_WEB_CONTAINER_PORT);
  process.env.E2E_SMTP_PORT = await readHostPort('maildev', MAILDEV_SMTP_CONTAINER_PORT);
}

async function waitUntil(label: string, isReady: () => Promise<boolean>): Promise<void> {
  const deadline = Date.now() + WAIT_LIMIT_MS;
  while (Date.now() < deadline) {
    if (await isReady().catch(() => false)) return;
    await sleep(WAIT_STEP_MS);
  }
  throw new Error(`[e2e] ${label} not ready after ${WAIT_LIMIT_MS} ms`);
}

async function isPostgresReady(): Promise<boolean> {
  await captureCompose(['exec', '-T', 'postgres', 'pg_isready', '-U', 'postgres']);
  return true;
}

async function isMailDevReady(): Promise<boolean> {
  const port = process.env.E2E_MAILDEV_WEB_PORT ?? String(MAILDEV_WEB_PORT);
  await listMailDevMessages(`http://localhost:${port}`);
  return true;
}

/**
 * Lists the containers this run must start (those not running yet), and
 * points the run at an already-running MailDev's ports. Known before
 * `startContainers`, so an interrupted start still stops exactly these.
 */
export async function planContainers(): Promise<string[]> {
  const running = await listRunningServices();
  if (running.includes('maildev')) await adoptRunningMailDev();
  return SERVICES.filter((service) => !running.includes(service));
}

/** Starts `toStart` and waits until Postgres and MailDev answer; the caller stops them. */
export async function startContainers(toStart: readonly string[]): Promise<void> {
  if (toStart.length > 0) await runCompose(['up', '-d', ...toStart]);
  await waitUntil('postgres', isPostgresReady);
  await waitUntil('maildev', isMailDevReady);
}

/** Stops only the containers `planContainers` said this run starts. */
export async function stopContainers(started: readonly string[]): Promise<void> {
  if (started.length === 0) return;
  await runCompose(['stop', ...started]);
}
