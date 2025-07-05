import { PaymentHistory } from "@/components/payment-history";

export default function PaymentsPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Payment History</h2>
      <PaymentHistory />
    </div>
  );
}
