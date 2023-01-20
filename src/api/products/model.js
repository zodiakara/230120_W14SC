import mongoose, { SchemaType } from "mongoose";

const { Schema, model } = mongoose;

const reviewsSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, required: true, enum: [1, 2, 3, 4, 5] },
  },
  { timestamps: true }
);

const productsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    reviews: [reviewsSchema],
  },
  { timestamps: true }
);

export default model("Products", productsSchema);
