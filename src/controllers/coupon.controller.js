import {
  createCoupon as createCouponService,
  deleteCoupon as deleteCouponService,
  getAllCoupons,
  updateCoupon as updateCouponService,
  validateCoupon as validateCouponService,
} from "../services/coupon.service.js";

export const getCoupons = async (req, res) => {
  const coupons = await getAllCoupons();
  res.json(coupons);
};

export const createCoupon = async (req, res) => {
  const result = await createCouponService(req.body);
  res.json(result);
};

export const updateCoupon = async (req, res) => {
  const coupon = await updateCouponService(req.params.id, req.body);
  res.json(coupon);
};

export const deleteCoupon = async (req, res) => {
  const result = await deleteCouponService(req.params.id);
  res.json(result);
};

export const validateCoupon = async (req, res) => {
  const result = await validateCouponService(req.body.couponCode);
  res.json({
    success: true,
    discount: result.discount,
    message: "Coupon is valid",
  });
};
