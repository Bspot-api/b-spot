/**
 * HTTP as the native app speaks it: no cookie jar, no browser headers
 * (no Origin, no Sec-Fetch-*), redirects not followed. Node's fetch adds
 * `sec-fetch-mode`, which Better-Auth's CSRF check treats as a browser, so
 * this goes through node:http.
 */
import http from 'node:http';
import { API_URL } from '../env/e2e-env';

export interface NativeResponse {
  status: number;
  location: string | null;
  body: string;
}

export interface NativeRequest {
  method: 'GET' | 'POST';
  /** Path and query on the e2e API, or a full URL on it. */
  path: string;
  headers?: Record<string, string>;
  body?: unknown;
}

/** Sends one request to the e2e API the way native fetch would. */
export function sendNativeRequest(request: NativeRequest): Promise<NativeResponse> {
  const url = new URL(request.path, API_URL);
  const payload = request.body === undefined ? undefined : JSON.stringify(request.body);
  const headers = {
    ...(payload === undefined ? {} : { 'content-type': 'application/json' }),
    ...request.headers,
  };
  return new Promise((resolve, reject) => {
    const req = http.request(url, { method: request.method, headers }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk: string) => (body += chunk));
      res.on('end', () =>
        resolve({ status: res.statusCode ?? 0, location: res.headers.location ?? null, body }),
      );
    });
    req.on('error', reject);
    req.end(payload);
  });
}
