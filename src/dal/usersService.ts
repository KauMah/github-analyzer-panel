import { auth } from '@clerk/nextjs/server';

export async function createUser() {
  const { userId } = await auth();
}
