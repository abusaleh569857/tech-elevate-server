import express from "express";

import { createPaymentIntent } from "../controllers/payment.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/create-payment-intent", asyncHandler(createPaymentIntent));

export default router;
