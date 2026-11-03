import { MAILDEV_URL } from '../env/e2e-env';
import { sleep } from './wait';

/** MailDev 3 serves its REST API under /api; MailDev 2 at the root. */
const MESSAGE_LIST_PATHS = ['/api/email', '/email'] as const;
const POLL_STEP_MS = 250;
const DEFAULT_MAGIC_LINK_TIMEOUT_MS = 10_000;
const MAGIC_LINK = /https?:\/\/\S+\/api\/auth\/magic-link\/verify\?token=[^\s"<>]+/;

interface MailDevAddress {
  address: string;
}

export interface MailDevMessage {
  to: MailDevAddress[];
  text?: string;
  /** MailDev 3 */
  time?: string;
  /** MailDev 2 */
  date?: string;
}

export interface MagicLinkQuery {
  email: string;
  since: Date;
  timeoutMs?: number;
}

/** Lists every message MailDev holds, whatever its major version. */
export async function listMailDevMessages(
  baseUrl: string = MAILDEV_URL,
): Promise<MailDevMessage[]> {
  for (const listPath of MESSAGE_LIST_PATHS) {
    const response = await fetch(`${baseUrl}${listPath}`);
    if (response.ok) return (await response.json()) as MailDevMessage[];
  }
  throw new Error(`MailDev at ${baseUrl} exposes no message list`);
}

function readReceivedAt(message: MailDevMessage): number {
  return new Date(message.time ?? message.date ?? 0).getTime();
}

function findMagicLink(messages: MailDevMessage[], query: MagicLinkQuery): string | null {
  const candidates = messages
    .filter((message) => message.to.some((to) => to.address === query.email))
    .filter((message) => readReceivedAt(message) >= query.since.getTime())
    .sort((a, b) => readReceivedAt(b) - readReceivedAt(a));
  const match = candidates[0]?.text?.match(MAGIC_LINK);
  return match ? match[0] : null;
}

/** Returns the newest magic link MailDev received for `email` since `since`. */
export async function fetchLatestMagicLink(query: MagicLinkQuery): Promise<string> {
  const deadline = Date.now() + (query.timeoutMs ?? DEFAULT_MAGIC_LINK_TIMEOUT_MS);
  let messages: MailDevMessage[] = [];
  while (Date.now() < deadline) {
    messages = await listMailDevMessages();
    const link = findMagicLink(messages, query);
    if (link) return link;
    await sleep(POLL_STEP_MS);
  }
  const seen = messages.flatMap((message) => message.to.map((to) => to.address)).join(', ');
  throw new Error(
    `No magic link for ${query.email} in MailDev (recipients seen: ${seen || 'none'})`,
  );
}
