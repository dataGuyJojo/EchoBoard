import { z } from 'zod';

export const reviewSchema = z.object({
  clarity: z.number().min(1).max(10),
  engagement: z.number().min(1).max(10),
  fairness: z.number().min(1).max(10),
  materials: z.number().min(1).max(10),
  difficulty: z.number().min(1).max(10),
  teaching: z.number().min(1).max(10),
  courseQuality: z.number().min(1).max(10),
  learning: z.number().min(1).max(10),
  message: z.string().max(500, 'Please keep the message under 500 characters').optional(),
});

// export type ReviewSchemaType = z.infer<typeof reviewSchema>;
