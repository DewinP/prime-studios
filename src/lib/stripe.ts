import Stripe from "stripe";
import { env } from "@/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

export type StripePaymentIntent = Stripe.PaymentIntent;
export type StripeProduct = Stripe.Product;
export type StripePrice = Stripe.Price;
