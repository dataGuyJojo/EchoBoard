import { z } from 'zod';
import { departments } from '@/model/User';

// Regexes (case-insensitive)
const studentEmailRegex = /^\d{7}@student\.ruet\.ac\.bd$/i;
const teacherEmailRegex = new RegExp(
  `^.+@(${departments.join('|')})\\.ruet\\.ac\\.bd$`,
  "i"
);

export const signinSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .refine((val) => studentEmailRegex.test(val) || teacherEmailRegex.test(val), {
      message: 'Email must be a valid RUET student or teacher email',
    }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
});

// export type SigninSchemaType = z.infer<typeof signinSchema>;
