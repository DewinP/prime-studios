# Stripe Integration Setup

This guide will help you set up Stripe payments in your studio application.

## Prerequisites

1. A Stripe account with a product created
2. Your Stripe API keys

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## Database Setup

1. Generate the Prisma client with the new Payment model:

   ```bash
   pnpm db:generate
   ```

2. Push the database changes:
   ```bash
   pnpm db:push
   ```

## Stripe Webhook Setup

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Add a new endpoint with the URL: `https://your-domain.com/api/stripe/webhook`
4. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

## Usage

### Basic Payment Form

```tsx
import { PaymentForm } from "@/components/payment-form";

<PaymentForm
  amount={2000} // $20.00 in cents
  productId="prod_your_product_id_here"
  description="Studio Session Payment"
  metadata={{
    sessionType: "recording",
    duration: "2 hours",
  }}
  onSuccess={() => {
    console.log("Payment successful!");
  }}
  onCancel={() => {
    console.log("Payment cancelled");
  }}
/>;
```

### Payment History

```tsx
import { PaymentHistory } from "@/components/payment-history";

<PaymentHistory />;
```

## API Routes

- `POST /api/stripe/create-payment-intent` - Creates a payment intent
- `POST /api/stripe/webhook` - Handles Stripe webhooks

## TRPC Endpoints

- `payment.createPaymentIntent` - Create a payment intent
- `payment.getPaymentHistory` - Get user's payment history
- `payment.getPaymentStatus` - Get status of a specific payment

## Testing

1. Visit `/payment` to test the payment form
2. Use Stripe test cards for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Production Deployment

1. Update environment variables with production Stripe keys
2. Update webhook URL to your production domain
3. Ensure your database is properly migrated

## Security Notes

- Never expose your Stripe secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Implement proper error handling
