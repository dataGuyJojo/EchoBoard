import { email, z } from 'zod';

export const verifySchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().length(6, 'Verification code must be exactly 6 characters long'),
});

// export type AcceptReview = z.infer<typeof verifySchema>;
