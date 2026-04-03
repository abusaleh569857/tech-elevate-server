import express from "express";

import {
  createReview,
  getReviewsByProduct,
} from "../controllers/review.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/products/:id/reviews", asyncHandler(getReviewsByProduct));
router.post("/reviews", asyncHandler(createReview));

export default router;
