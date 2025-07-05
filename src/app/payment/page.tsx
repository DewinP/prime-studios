"use client";

import { PaymentForm } from "@/components/payment-form";

export default function PaymentPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Payment</h1>
        <PaymentForm
          amount={5000} // $50.00 in cents
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
        />
      </div>
    </div>
  );
}
