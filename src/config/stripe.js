import Stripe from "stripe";

import { stripeSecretKey } from "./env.js";

const stripe = new Stripe(stripeSecretKey);

export default stripe;
