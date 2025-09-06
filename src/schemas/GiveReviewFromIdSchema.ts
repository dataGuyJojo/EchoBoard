import { ClassModel } from '@/model/Class';
import { z } from 'zod';


export const GiveReviewFromIdSchema = z.object({
  ClassId: z.string().min(5),
});
