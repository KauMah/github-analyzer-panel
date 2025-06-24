import { prisma } from '@/lib/prisma';
import {
  UserCreateParams,
  userCreateParamsSchema,
} from '@/lib/validators/user';
import posthog from 'posthog-js';

export async function createUser(createUser: unknown) {
  try {
    const user: UserCreateParams =
      await userCreateParamsSchema.parseAsync(createUser);
    const existingUser = await prisma.user.findFirst({
      where: { clerkId: user.clerkId },
    });
    if (!existingUser) {
      return prisma.user.create({ data: user });
    }
  } catch (error) {
    posthog.captureException(error);
  }
}
