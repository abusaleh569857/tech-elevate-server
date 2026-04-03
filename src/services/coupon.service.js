import { collections } from "../config/db.js";
import createHttpError from "../utils/httpError.js";
import { toObjectId } from "../utils/objectId.js";

export const getAllCoupons = async () => collections.coupons.find().toArray();

export const createCoupon = async (coupon) => collections.coupons.insertOne(coupon);

export const updateCoupon = async (id, updatedData) => {
  const couponId = toObjectId(id);
  const result = await collections.coupons.findOneAndUpdate(
    { _id: couponId },
    { $set: updatedData },
    { returnDocument: "after" }
  );

  if (!result) {
    throw createHttpError(404, "Coupon not found.");
  }

  return result;
};

export const deleteCoupon = async (id) => {
  const couponId = toObjectId(id);
  return collections.coupons.deleteOne({ _id: couponId });
};

export const validateCoupon = async (couponCode) => {
  const coupon = await collections.coupons.findOne({ code: couponCode });

  if (!coupon || new Date() > new Date(coupon.expiryDate)) {
    throw createHttpError(400, "Invalid or expired coupon code");
  }

  return {
    discount: coupon.discount,
  };
};
