import express from "express";

import {
  createProduct,
  deleteProduct,
  deleteReportedProduct,
  getAcceptedProducts,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProducts,
  getReportedProducts,
  getTrendingProducts,
  reportProduct,
  updateProduct,
  updateProductStatus,
  upvoteProduct,
  upvoteProductLegacy,
} from "../controllers/product.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/products", asyncHandler(getProducts));
router.get("/products/:id", asyncHandler(getProductById));
router.get("/accepted-products", asyncHandler(getAcceptedProducts));
router.get("/all-products", asyncHandler(getAllProducts));
router.get("/reported-products", asyncHandler(getReportedProducts));
router.get("/products-featured", asyncHandler(getFeaturedProducts));
router.get("/products-trending", asyncHandler(getTrendingProducts));

router.post("/add-products", asyncHandler(createProduct));
router.post("/products/:id/upvote", authenticateToken, asyncHandler(upvoteProduct));
router.post(
  "/products/upvote/:id",
  authenticateToken,
  asyncHandler(upvoteProductLegacy)
);
router.post("/products/:id/report", authenticateToken, asyncHandler(reportProduct));

router.put("/products/:id", asyncHandler(updateProduct));
router.patch("/update-products/:id", asyncHandler(updateProductStatus));

router.delete("/products/:id", asyncHandler(deleteProduct));
router.delete("/reported/products/:id", asyncHandler(deleteReportedProduct));

export default router;
