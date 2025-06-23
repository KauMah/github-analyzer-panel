import z from 'zod';

export const userCreateParamsSchema = z.object({
  clerkId: z.string().min(1), // simple id validation, could use regex
});

export type UserCreateParams = z.infer<typeof userCreateParamsSchema>;

export const userSchema = z.object({
  clerkId: z.string().min(1),
  id: z.string().cuid(),
});

export type User = z.infer<typeof userSchema>;
