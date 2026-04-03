import express from "express";

import {
  getAllUsers,
  getUser,
  saveUser,
  updateSubscription,
  updateUserRole,
} from "../controllers/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/users", asyncHandler(getUser));
router.get("/all-users", asyncHandler(getAllUsers));
router.post("/users", asyncHandler(saveUser));
router.put("/users/:id/role", asyncHandler(updateUserRole));
router.put("/update-subscription", asyncHandler(updateSubscription));

export default router;
