import { createPaymentIntent as createPaymentIntentService } from "../services/payment.service.js";

export const createPaymentIntent = async (req, res) => {
  const clientSecret = await createPaymentIntentService(req.body.amount);
  res.json({ clientSecret });
};
