import { ActionResult } from '@/actions/types';
import { env } from '@/env';
import crypto from 'crypto';

function generateHmacSignature(body: string, timestamp: string): string {
  const message = `${timestamp}.${body}`;
  return crypto
    .createHmac('sha256', env.API_SECRET_KEY)
    .update(message)
    .digest('hex');
}

export async function commitFetch<T>(
  path: string,
  options: RequestInit
): Promise<ActionResult<T>> {
  const url = `${env.BACKEND_URL}${path}`;
  const body = options.body;
  if (!body) {
    throw new Error('Body was empty');
  }

  const ts = Math.floor(Date.now() / 1000).toString();
  const signature = generateHmacSignature(body.toString(), ts);

  const headers = new Headers(options.headers ?? {});
  headers.set('x-api-timestamp', ts);
  headers.set('x-api-signature', signature);
  headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      return {
        success: false,
        error: `HTTP: ${response.status}: ${response.statusText}`,
      };
    }
    const data = (await response.json()) as T;
    return { success: true, data };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}
