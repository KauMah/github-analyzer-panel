// instrumentation-client.js
import posthog from 'posthog-js';
import { env } from '@/env';

posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: '/relay-ph',
  capture_pageview: 'history_change',
  ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
});
