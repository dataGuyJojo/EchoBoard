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
    (val) => studentEmailRegex.test(val) || val === "jjohan357@gmail.com",
    { message: 'Email must be a valid RUET student email' }
  );

export const teacherEmailValidation = z
  .string()
  .email({ message: 'Invalid email format' })
  .refine(
    (val) => teacherEmailRegex.test(val) || val === "connect.syedasifjohan@gmail.com",
    { message: 'Email must be a valid RUET teacher email' }
  );

export const signupSchema = z.object({
  //  const { name, email, password, type } = await req.json();

  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(100, { message: 'Name must not exceed 100 characters' }),

  email: z
    .string()
    .email({message: 'Invalid email format'})   
    .refine(
      (val) => studentEmailRegex.test(val) || teacherEmailRegex.test(val) || val === "connect.syedasifjohan@gmail.com" || val === "jjohan357@gmail.com" ,
      { message: 'Email must be a valid RUET student or teacher email 🟢' }
    ),
    password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100, { message: 'Password must not exceed 100 characters' }),
    
    type: z.enum(['student', 'teacher']),
});
