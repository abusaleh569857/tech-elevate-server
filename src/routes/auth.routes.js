import express from "express";

import { createJwtToken } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/jwt", asyncHandler(createJwtToken));

export default router;
