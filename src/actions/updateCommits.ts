'use server';
import { commitFetch } from '@/lib/commitApi';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';

export async function updateCommits() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const clerk = await clerkClient();
    const tokenResponse = await clerk.users.getUserOauthAccessToken(
      userId ?? '',
      'github'
    );
    const token = tokenResponse.data[0]?.token;
    const username = user?.username;

    if (!username || !token) {
      throw new Error('Username or token not available');
    }
    return await commitFetch<number>('/', {
      method: 'POST',
      body: JSON.stringify({ token, username }),
    });
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}
