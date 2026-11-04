import assert from 'node:assert/strict';
import net from 'node:net';
import { describe, it } from 'node:test';
import { assertPortsFree } from './port-preflight';

function listen(host: string): Promise<net.Server> {
  const server = net.createServer();
  return new Promise((resolve) => server.listen(0, host, () => resolve(server)));
}

function portOf(server: net.Server): number {
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('no TCP address');
  return address.port;
}

function close(server: net.Server): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}

describe('assertPortsFree', () => {
  it('passes when nothing listens on the ports', async () => {
    const server = await listen('127.0.0.1');
    const freePort = portOf(server);
    await close(server);

    await assertPortsFree([freePort]);
  });

  it('fails naming the busy port and the pid that holds it', async () => {
    const server = await listen('127.0.0.1');
    const busyPort = portOf(server);

    const actualCheck = assertPortsFree([busyPort]);

    await assert.rejects(actualCheck, (error: Error) => {
      assert.match(error.message, new RegExp(`port ${busyPort}`));
      assert.match(error.message, new RegExp(`pid ${process.pid}`));
      return true;
    });
    await close(server);
  });

  it('sees a listener bound to IPv6 localhost only', async () => {
    const server = await listen('::1');
    const busyPort = portOf(server);

    const actualCheck = assertPortsFree([busyPort]);

    await assert.rejects(actualCheck, new RegExp(`port ${busyPort}`));
    await close(server);
  });
});
