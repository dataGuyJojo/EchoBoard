
import { ReviewRating } from "@/model/Review";
export interface ApiResponse {
  success: boolean;
  message: string;
  acceptingReviews?: boolean;
  reviewRatings?: Array<ReviewRating>;
}
