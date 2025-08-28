import { z } from 'zod';
import { departments } from '@/model/User';

// Regexes (case-insensitive)
const studentEmailRegex = /^\d{7}@student\.ruet\.ac\.bd$/i;
const teacherEmailRegex = new RegExp(
  `^.+@(${departments.join('|')})\\.ruet\\.ac\\.bd$`,
  "i"
);

export const studentEmailValidation = z
  .string()
  .email({ message: 'Invalid email format' })
  .refine(
    (val) => studentEmailRegex.test(val),
    { message: 'Email must be a valid RUET student email' }
  );

export const teacherEmailValidation = z
  .string()
  .email({ message: 'Invalid email format' })
  .refine(
    (val) => teacherEmailRegex.test(val),
    { message: 'Email must be a valid RUET teacher email' }
  );

export const signupSchema = z.object({

  email: z
    .string()
    .email({message: 'Invalid email format'})   
    .refine(
      (val) => studentEmailRegex.test(val) || teacherEmailRegex.test(val),
      { message: 'Email must be a valid RUET student or teacher email' }
    ),
    password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password must not exceed 100 characters' }),
    
    
});
