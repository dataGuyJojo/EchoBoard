
import { ReviewRating } from '@/model/User';
export interface ApiResponse {
  success: boolean;
  message: string;
  acceptingReviews?: boolean;
  reviewRatings?: Array<ReviewRating>;
}
