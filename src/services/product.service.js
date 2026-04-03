import { collections } from "../config/db.js";
import { PRODUCT_STATUSES } from "../constants/product.js";
import createHttpError from "../utils/httpError.js";
import { toObjectId } from "../utils/objectId.js";

export const getProductsByOwnerEmail = async (ownerEmail) =>
  collections.products.find({ ownerEmail }).toArray();

export const getProductById = async (id) =>
  collections.products.findOne({ _id: toObjectId(id) });

export const getAcceptedProducts = async ({
  search = "",
  page = 1,
  limit = 6,
}) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.max(Number(limit) || 6, 1);
  const skip = (normalizedPage - 1) * normalizedLimit;

  const query = {
    status: PRODUCT_STATUSES.accepted,
    tags: { $regex: search, $options: "i" },
  };

  const total = await collections.products.countDocuments(query);
  const products = await collections.products
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(normalizedLimit)
    .toArray();

  return {
    products,
    totalPages: Math.ceil(total / normalizedLimit),
  };
};

export const getAllProducts = async () => collections.products.find({}).toArray();

export const getReportedProducts = async () =>
  collections.products
    .find({ reports: { $gt: 0 } })
    .sort({ reports: -1 })
    .toArray();

export const getFeaturedProducts = async () =>
  collections.products
    .find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(4)
    .toArray();

export const getTrendingProducts = async () =>
  collections.products.find({}).sort({ upvotes: -1 }).limit(8).toArray();

export const addProduct = async (payload) => {
  const { ownerEmail } = payload;

  const user = await collections.users.findOne({ email: ownerEmail });

  if (!user) {
    throw createHttpError(404, "User not found.");
  }

  const userProductsCount = await collections.products.countDocuments({
    ownerEmail,
  });

  if (!user.isSubscribed && userProductsCount >= 1) {
    throw createHttpError(
      403,
      "You can only add one product. Subscribe to add more products."
    );
  }

  const newProduct = {
    productName: payload.productName,
    productImage: payload.productImage,
    description: payload.description,
    ownerName: payload.ownerName,
    ownerEmail,
    ownerImage: payload.ownerImage,
    tags: payload.tags || [],
    externalLink: payload.externalLink,
    upvotes: 0,
    downvotes: 0,
    reports: 0,
    voters: [],
    reportedBy: [],
    status: PRODUCT_STATUSES.pending,
    isFeatured: false,
    createdAt: new Date(),
  };

  const result = await collections.products.insertOne(newProduct);
  return result.insertedId;
};

export const updateProduct = async (id, updatedProduct) => {
  const productId = toObjectId(id);
  const safeUpdate = { ...updatedProduct };
  delete safeUpdate._id;

  const result = await collections.products.updateOne(
    { _id: productId },
    { $set: safeUpdate }
  );

  if (!result.matchedCount) {
    throw createHttpError(404, "Product not found.");
  }
};

export const updateProductStatus = async (id, { action, isFeatured }) => {
  const updateFields = {};

  if (action === "Accept") {
    updateFields.status = PRODUCT_STATUSES.accepted;
  }

  if (action === "Reject") {
    updateFields.status = PRODUCT_STATUSES.rejected;
  }

  if (isFeatured === true) {
    updateFields.isFeatured = true;
  }

  const result = await collections.products.updateOne(
    { _id: toObjectId(id) },
    { $set: updateFields }
  );

  if (!result.matchedCount) {
    throw createHttpError(404, "Product not found.");
  }
};

export const deleteProduct = async (id) => {
  const result = await collections.products.deleteOne({ _id: toObjectId(id) });

  if (!result.deletedCount) {
    throw createHttpError(404, "Product not found.");
  }
};

export const upvoteProduct = async ({
  id,
  voterEmail,
  preventOwnerVote = true,
}) => {
  const product = await getProductById(id);

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  if (preventOwnerVote && product.ownerEmail === voterEmail) {
    throw createHttpError(403, "You cannot vote on your own product");
  }

  if (product.voters?.includes(voterEmail)) {
    throw createHttpError(400, "You can only vote once");
  }

  await collections.products.updateOne(
    { _id: product._id },
    { $inc: { upvotes: 1 }, $push: { voters: voterEmail } }
  );
};

export const reportProduct = async ({ id, reporterEmail }) => {
  const product = await getProductById(id);

  if (!product) {
    throw createHttpError(404, "Product not found");
  }

  if (product.ownerEmail === reporterEmail) {
    throw createHttpError(403, "You cannot report your own product");
  }

  if (product.reportedBy?.includes(reporterEmail)) {
    throw createHttpError(400, "You have already reported this product");
  }

  await collections.products.updateOne(
    { _id: product._id },
    {
      $inc: { reports: 1 },
      $push: { reportedBy: reporterEmail },
    }
  );
};
