import mongoose, { Schema, Document } from 'mongoose';
import { de } from 'zod/locales';
// Schema and Document is used as TypeScript is used here


export const departments = [
  'ipe', 'gce', 'mse', 'ce', 'becm', 'arch', 'urp', 'eee', 
  'cse', 'ete', 'ece', 'chem', 'phy', 'math', 'hum', 'bme', 'mte', 'che'
] as const; 


export interface ReviewRating extends Document {
  clarity: number;
  engagement: number;
  fairness: number;
  materials: number;
  difficulty: number;
  teaching: number;
  courseQuality: number;
  learning: number;
  message: string;
  createdAt: Date;
}


const ReviewRatingSchema: Schema<ReviewRating> = new Schema({
  clarity: {
    type: Number,
    required: [true, 'Clarity rating is required'],
  },
  engagement: {
    type: Number,
    required: [true, 'Engagement rating is required'],
  },
  fairness: {
    type: Number,
    required: [true, 'Fairness rating is required'],

  },
  materials: {
    type: Number,
    required: [true, 'Materials rating is required'],
   
  },
  difficulty: {
    type: Number,
    required: [true, 'Difficulty rating is required'],
   
  },
  teaching: {
    type: Number,
    required: [true, 'Teaching rating is required'],
   
  },
  courseQuality: {
    type: Number,
    required: [true, 'Course quality rating is required'],
   
  },
  learning: {
    type: Number,
    required: [true, 'Learning rating is required'],
   
  },
  message: {
    type: String
    // Optional message field for additional feedback
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


// Class schema

// class interface
export interface Class extends Document {
  name: string;
  teacherID: string;
  ReviewRatings: ReviewRating[];
  createdAt: Date;
}

// class Schema
const ClassSchema: Schema<Class> = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  teacherID: {
    type: String,
    required: [true, 'Teacher is required'],
  },
  ReviewRatings: {
    type: [ReviewRatingSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


// Updated User schema


// User interface
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  type: 'Teacher' | 'Student';
  roll?: string;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingReviews: boolean;

  classes: Class[];

  
}

const UserSchema: Schema<User> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        // Check if it's a student email
        const studentEmailRegex = new RegExp(`^\\d{7}@student\\.ruet\\.ac\\.bd$`);
          if (studentEmailRegex.test(email)) {
            return true;
        }
        // Check if it's a teacher email
       const teacherEmailRegex = new RegExp(`^.+@(${departments.join('|')})\\.ruet\\.ac\\.bd$`);
       if (teacherEmailRegex.test(email)) {
        return true;
       }
        return false;
      },
      message: 'Please use a valid RUET email address',
    },
  },
  type: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['Teacher', 'Student'],
      message: 'Type must be either Teacher or Student',
    },
  },
  roll: {
    type: String,
    validate: {
      validator: function(roll: string) {
        // Roll is required only for students
        if (this.type === 'Student') {
          return roll && /^\d{7}$/.test(roll);
        }
        return true;
      },
      message: 'Roll number must be 7 digits for students',
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify code expiry is required'],
  },
  isAcceptingReviews: {
    type: Boolean,
    default: true,
  },

  classes: [ClassSchema]
  
});



// Export models
const UserModel = 
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

const ReviewRatingsModel = 
  (mongoose.models.ReviewRatings as mongoose.Model<ReviewRating>) ||
  mongoose.model<ReviewRating>('ReviewRatings', ReviewRatingSchema);


export { ReviewRatingsModel};
export default UserModel;