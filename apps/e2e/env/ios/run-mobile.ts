/**
 * `pnpm e2e:mobile`: with a booted iOS simulator and the dev build
 * installed, brings the shared e2e environment up, adds the Metro the dev
 * build loads its JS from and the control server, runs the Maestro flows,
 * tears down what it started, and exits with Maestro's code.
 */
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { E2E_ROOT, MAESTRO_RESULTS_DIR, MAESTRO_ROOT } from '../e2e-env';
import { withE2eEnvironment } from '../environment';
import { runCommandForExitCode } from '../process';
import { assertBundleUsesApiUrl } from './bundle-preflight';
import { startControlServer } from './control-server';
import { buildMaestroEnv } from './maestro-env';
import { startMetro } from './metro';
import { assertDevBuildInstalled, findBootedSimulator } from './simulator';

/** Where Maestro's installer puts the CLI; the PATH is the fallback. */
const MAESTRO_HOME_BINARY = path.join(os.homedir(), '.maestro', 'bin', 'maestro');

function resolveMaestroBinary(): string {
  return existsSync(MAESTRO_HOME_BINARY) ? MAESTRO_HOME_BINARY : 'maestro';
}

function runMaestro(udid: string): Promise<number> {
  const variables = Object.entries(buildMaestroEnv()).flatMap(([key, value]) => [
    '-e',
    `${key}=${value}`,
  ]);
  const args = ['--device', udid, 'test', path.join(MAESTRO_ROOT, 'flows')]
    .concat(['--format', 'junit', '--output', path.join(MAESTRO_RESULTS_DIR, 'report.xml')])
    .concat(['--debug-output', MAESTRO_RESULTS_DIR, ...variables, ...process.argv.slice(2)]);
  return runCommandForExitCode(resolveMaestroBinary(), args, { cwd: E2E_ROOT });
}

async function runFlows(udid: string): Promise<number> {
  const metro = await startMetro();
  try {
    await assertBundleUsesApiUrl();
    const control = await startControlServer(udid);
    try {
      return await runMaestro(udid);
    } finally {
      await control.stop();
    }
  } finally {
    await metro.stop();
  }
}

async function main(): Promise<number> {
  const device = await findBootedSimulator();
  await assertDevBuildInstalled(device.udid);
  console.log(`[e2e] iOS simulator: ${device.name} (${device.udid})`);
  return withE2eEnvironment({ hasWebApp: false }, () => runFlows(device.udid));
}

main()
  .then((code) => process.exit(code))
  .catch((error: unknown) => {
    console.error('[e2e] mobile run failed:', error);
    process.exit(1);
  });
