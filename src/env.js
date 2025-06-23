import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    CLERK_SECRET_KEY: z.string(),
    DATABASE_URL: z.string(),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  },
});
