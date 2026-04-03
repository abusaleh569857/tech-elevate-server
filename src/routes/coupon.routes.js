import express from "express";

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/coupon.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/coupons", asyncHandler(getCoupons));
router.post("/coupons", asyncHandler(createCoupon));
router.post("/validate-coupon", asyncHandler(validateCoupon));
router.put("/coupons/:id", asyncHandler(updateCoupon));
router.delete("/coupons/:id", asyncHandler(deleteCoupon));

export default router;
