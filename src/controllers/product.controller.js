import createHttpError from "../utils/httpError.js";
import {
  addProduct,
  deleteProduct as deleteProductService,
  getAcceptedProducts as getAcceptedProductsService,
  getAllProducts as getAllProductsService,
  getFeaturedProducts as getFeaturedProductsService,
  getProductById as getProductByIdService,
  getProductsByOwnerEmail,
  getReportedProducts as getReportedProductsService,
  getTrendingProducts as getTrendingProductsService,
  reportProduct as reportProductService,
  updateProduct as updateProductService,
  updateProductStatus as updateProductStatusService,
  upvoteProduct as upvoteProductService,
} from "../services/product.service.js";

export const getProducts = async (req, res) => {
  const { ownerEmail } = req.query;

  if (!ownerEmail) {
    return res.status(400).json({ error: "Owner email is required." });
  }

  const products = await getProductsByOwnerEmail(ownerEmail);
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await getProductByIdService(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found." });
  }

  res.status(200).json(product);
};

export const getAcceptedProducts = async (req, res) => {
  const result = await getAcceptedProductsService(req.query);
  res.json(result);
};

export const getAllProducts = async (req, res) => {
  const products = await getAllProductsService();
  res.status(200).json(products);
};

export const getReportedProducts = async (req, res) => {
  const products = await getReportedProductsService();
  res.status(200).json(products);
};

export const getFeaturedProducts = async (req, res) => {
  const products = await getFeaturedProductsService();

  if (!products.length) {
    throw createHttpError(404, "No featured products found");
  }

  res.json(products);
};

export const getTrendingProducts = async (req, res) => {
  const products = await getTrendingProductsService();

  if (!products.length) {
    throw createHttpError(404, "No trending products found");
  }

  res.json(products);
};

export const createProduct = async (req, res) => {
  const productId = await addProduct(req.body);
  res.status(201).json({
    success: true,
    message: "Product added successfully.",
    productId,
  });
};

export const updateProduct = async (req, res) => {
  await updateProductService(req.params.id, req.body);
  res.json({ message: "Product updated successfully." });
};

export const updateProductStatus = async (req, res) => {
  await updateProductStatusService(req.params.id, req.body);
  res
    .status(200)
    .json({ success: true, message: "Product updated successfully." });
};

export const deleteProduct = async (req, res) => {
  await deleteProductService(req.params.id);
  res.json({ message: "Product deleted successfully." });
};

export const deleteReportedProduct = async (req, res) => {
  await deleteProductService(req.params.id);
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
};

export const upvoteProduct = async (req, res) => {
  await upvoteProductService({
    id: req.params.id,
    voterEmail: req.user.email,
    preventOwnerVote: true,
  });

  res.json({ message: "Vote recorded" });
};

export const upvoteProductLegacy = async (req, res) => {
  await upvoteProductService({
    id: req.params.id,
    voterEmail: req.user.email,
    preventOwnerVote: true,
  });

  res.json({ message: "Product upvoted successfully" });
};

export const reportProduct = async (req, res) => {
  await reportProductService({
    id: req.params.id,
    reporterEmail: req.user.email,
  });

  res.json({ message: "Product reported successfully" });
};
