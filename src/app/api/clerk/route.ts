import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { createUser } from '@/dal/usersService';

export async function POST(request: NextRequest) {
  const wh_secret = env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!wh_secret) {
    return NextResponse.json(
      { message: 'Clerk webhook key not set' },
      { status: 500 }
    );
  }

  try {
    const evt = await verifyWebhook(request);

    const { id } = evt.data;
    const eventType = evt.type;
    if (eventType === 'user.created') {
      if (!!id) {
        await createUser({ clerkId: id });
        return new Response('Webhook received', { status: 200 });
      } else {
        return new Response('Webhook received, id not found', { status: 500 });
      }
    }
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
