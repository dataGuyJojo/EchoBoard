// src/model/Review.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ReviewRating extends Document {
  clarity: number;
  engagement: number;
  fairness: number;
  materials: number;
  difficulty: number;
  teaching: number;
  courseQuality: number;
  learning: number;
  message?: string;
  createdAt: Date;

}

const reviewRatingschema: Schema<ReviewRating> = new Schema({
  clarity: { type: Number, required: [true, 'Clarity rating is required'] },
  engagement: { type: Number, required: [true, 'Engagement rating is required'] },
  fairness: { type: Number, required: [true, 'Fairness rating is required'] },
  materials: { type: Number, required: [true, 'Materials rating is required'] },
  difficulty: { type: Number, required: [true, 'Difficulty rating is required'] },
  teaching: { type: Number, required: [true, 'Teaching rating is required'] },
  courseQuality: { type: Number, required: [true, 'Course quality rating is required'] },
  learning: { type: Number, required: [true, 'Learning rating is required'] },
  message: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },

  
});

const ReviewModel =
  (mongoose.models.Review as mongoose.Model<ReviewRating>) ||
  mongoose.model<ReviewRating>('Review', reviewRatingschema);

export { reviewRatingschema, ReviewModel };
