import "dotenv/config";

const requiredEnvVars = [
  "DB_USER",
  "DB_PASS",
  "ACCESS_TOKEN_SECRET",
  "STRIPE_SECRET_KEY",
];

requiredEnvVars.forEach((variableName) => {
  if (!process.env[variableName]) {
    console.warn(`Missing environment variable: ${variableName}`);
  }
});

export const port = Number(process.env.PORT) || 5000;
export const dbUser = process.env.DB_USER;
export const dbPass = process.env.DB_PASS;
export const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export default {
  port,
  dbUser,
  dbPass,
  accessTokenSecret,
  stripeSecretKey,
};
