import stripe from "../config/stripe.js";

export const createPaymentIntent = async (amount) => {
  const priceInCents = Math.round(Number(amount) * 100);

  if (!priceInCents || priceInCents <= 0) {
    const error = new Error("A valid amount is required.");
    error.statusCode = 400;
    throw error;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: priceInCents,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return paymentIntent.client_secret;
};
