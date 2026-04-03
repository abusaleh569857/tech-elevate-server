import express from "express";

import { getSiteStatistics } from "../controllers/statistics.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/site-statistics", asyncHandler(getSiteStatistics));

export default router;
