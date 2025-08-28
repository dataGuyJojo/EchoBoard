// src/model.Class.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface Class extends Document {
  classCode: string;
  className: string;
  series: string;
  section: string;
  reviewRatings: Types.ObjectId[];
  createdAt: Date;
}

const classSchema: Schema<Class> = new Schema({
  classCode: { type: String, required: [true, "Class code is required"] },
  className: { type: String, required: [true, "Class name is required"] },
  series: { type: String, required: [true, "Series is required"] },
  section: { type: String, required: [true, "Section is required"] },
 reviewRatings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  createdAt: { type: Date, required: true, default: Date.now },
});

const ClassModel =
  (mongoose.models.Class as mongoose.Model<Class>) ||
  mongoose.model<Class>("Class", classSchema);

export { classSchema, ClassModel };
