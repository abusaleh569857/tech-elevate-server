import { collections } from "../config/db.js";

export const getSiteStatistics = async () => {
  const productCounts = await collections.products
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  const totalReviews = await collections.reviews.countDocuments();
  const totalUsers = await collections.users.countDocuments();

  const formattedProductCounts = productCounts.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }));

  return [
    ...formattedProductCounts,
    { name: "Reviews", value: totalReviews },
    { name: "Users", value: totalUsers },
  ];
};
