import { EmailPreview } from "@/components/email-preview";

export default function DashboardEmailPreviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Email Templates Preview</h1>
        <p className="text-muted-foreground">
          Preview how contact form and booking form submissions will look when
          sent to your company email.
        </p>
      </div>

      <EmailPreview />
    </div>
  );
}
