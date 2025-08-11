import { z } from 'zod';

export const acceptReviewSchema = z.object({
  isAcceptingReviews: z.boolean(),
});

// export type AcceptReviewSchemaType = z.infer<typeof acceptReviewSchema>;
