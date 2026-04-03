import express from "express";

import authRoutes from "./auth.routes.js";
import couponRoutes from "./coupon.routes.js";
import paymentRoutes from "./payment.routes.js";
import productRoutes from "./product.routes.js";
import reviewRoutes from "./review.routes.js";
import statisticsRoutes from "./statistics.routes.js";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(productRoutes);
router.use(reviewRoutes);
router.use(couponRoutes);
router.use(paymentRoutes);
router.use(statisticsRoutes);

export default router;
