import {
  createReview as createReviewService,
  getReviewsByProductId,
} from "../services/review.service.js";

export const getReviewsByProduct = async (req, res) => {
  const reviews = await getReviewsByProductId(req.params.id);
  res.json(reviews);
};

export const createReview = async (req, res) => {
  const result = await createReviewService(req.body);
  res.json(result);
};
