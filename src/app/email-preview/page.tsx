import { EmailPreview } from "@/components/email-preview";

export default function EmailPreviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Email Templates Preview</h1>
        <p className="text-muted-foreground">
          Preview all email templates used throughout the application including contact forms, booking inquiries, email verification, and order confirmations.
        </p>
      </div>

      <EmailPreview />
    </div>
  );
}
