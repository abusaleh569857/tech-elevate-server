import { collections } from "../config/db.js";

export const getReviewsByProductId = async (productId) =>
  collections.reviews.find({ productId }).toArray();

export const createReview = async (review) =>
  collections.reviews.insertOne(review);
