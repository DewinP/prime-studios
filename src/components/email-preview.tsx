"use client";

import { useEffect, useRef } from "react";
import {
  createContactEmailTemplate,
  createBookingEmailTemplate,
  createEmailVerificationTemplate,
  createOrderEmailTemplate,
} from "@/lib/email-templates";

interface EmailPreviewProps {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

// Use test email in development, actual domain in production
const getFromEmail = () => {
  if (process.env.NODE_ENV === "development") {
    return "onboarding@resend.dev";
  }
  return "no-reply@primestudiosnyc.com";
};

export function EmailPreview({
  name = "John Doe",
  email = "john@example.com",
  subject = "Studio Inquiry",
  message = "Hi, I'm interested in recording some tracks at your studio. Could you please provide more information about your rates and availability?",
}: EmailPreviewProps) {
  const contactIframeRef = useRef<HTMLIFrameElement>(null);
  const bookingIframeRef = useRef<HTMLIFrameElement>(null);
  const verificationIframeRef = useRef<HTMLIFrameElement>(null);
  const orderIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const contactEmailHtml = createContactEmailTemplate({
      name,
      email,
      subject,
      message,
      ipAddress: "192.168.1.1",
    });

    const bookingEmailHtml = createBookingEmailTemplate({
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (555) 123-4567",
      services: ["recording"],
      sessionDetails:
        "I'm looking to record a 3-song EP for my band. We need about 4-6 hours of studio time. We play alternative rock and would like to record drums, bass, guitar, and vocals. Our preferred dates are next week Tuesday through Thursday, anytime between 2 PM and 8 PM. We have our own instruments but will need studio equipment for recording.",
      ipAddress: "192.168.1.1",
    });

    const verificationEmailHtml = createEmailVerificationTemplate({
      url: "https://primestudiosnyc.com/api/auth/verify?token=example-verification-token",
    });

    const orderEmailHtml = createOrderEmailTemplate({
      orderNumber: "PS-2025-001",
      total: 2500, // $25.00
      items: [
        {
          trackName: "Midnight Groove",
          licenseType: "commercial",
          unitPrice: 1500, // $15.00
        },
        {
          trackName: "Urban Beat",
          licenseType: "personal",
          unitPrice: 1000, // $10.00
        },
      ],
      customerName: "Sarah Wilson",
    });

    if (contactIframeRef.current) {
      const doc = contactIframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(contactEmailHtml);
        doc.close();
      }
    }

    if (bookingIframeRef.current) {
      const doc = bookingIframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(bookingEmailHtml);
        doc.close();
      }
    }

    if (verificationIframeRef.current) {
      const doc = verificationIframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(verificationEmailHtml);
        doc.close();
      }
    }

    if (orderIframeRef.current) {
      const doc = orderIframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(orderEmailHtml);
        doc.close();
      }
    }
  }, [name, email, subject, message]);

  const fromEmail = getFromEmail();

  return (
    <div className="space-y-12">
      {/* Contact Form Email Preview */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="bg-muted mb-4 rounded-lg p-4">
          <h3 className="mb-2 text-lg font-semibold">
            Contact Form Email Preview
          </h3>
          <p className="text-muted-foreground text-sm">
            This is how contact form submissions will look when sent to
            primestudiosnyc@gmail.com
          </p>
        </div>

        <div className="border-border overflow-hidden rounded-lg border">
          <iframe
            ref={contactIframeRef}
            className="h-96 w-full border-0"
            title="Contact Email Preview"
          />
        </div>

        <div className="bg-muted mt-4 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Preview Details:</h4>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• From: {fromEmail}</li>
            <li>• To: primestudiosnyc@gmail.com</li>
            <li>• Reply-To: {email}</li>
            <li>• Subject: New Contact Form: {subject}</li>
            <li>
              • Sender: {name} ({email})
            </li>
          </ul>
        </div>
      </div>

      {/* Booking Email Preview */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="bg-muted mb-4 rounded-lg p-4">
          <h3 className="mb-2 text-lg font-semibold">
            Booking Inquiry Email Preview
          </h3>
          <p className="text-muted-foreground text-sm">
            This is how booking form submissions will look when sent to
            primestudiosnyc@gmail.com
          </p>
        </div>

        <div className="border-border overflow-hidden rounded-lg border">
          <iframe
            ref={bookingIframeRef}
            className="h-96 w-full border-0"
            title="Booking Email Preview"
          />
        </div>

        <div className="bg-muted mt-4 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Preview Details:</h4>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• From: {fromEmail}</li>
            <li>• To: primestudiosnyc@gmail.com</li>
            <li>• Reply-To: mike@example.com</li>
            <li>• Subject: New Booking Inquiry: Recording</li>
            <li>• Sender: Mike Johnson (mike@example.com)</li>
          </ul>
        </div>
      </div>

      {/* Email Verification Preview */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="bg-muted mb-4 rounded-lg p-4">
          <h3 className="mb-2 text-lg font-semibold">
            Email Verification Preview
          </h3>
          <p className="text-muted-foreground text-sm">
            This is how email verification emails will look when sent to new users
          </p>
        </div>

        <div className="border-border overflow-hidden rounded-lg border">
          <iframe
            ref={verificationIframeRef}
            className="h-96 w-full border-0"
            title="Email Verification Preview"
          />
        </div>

        <div className="bg-muted mt-4 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Preview Details:</h4>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• From: {fromEmail}</li>
            <li>• To: user@example.com</li>
            <li>• Subject: Email Verification</li>
            <li>• Purpose: Verify new user account registration</li>
            <li>• Action: Click verification link to activate account</li>
          </ul>
        </div>
      </div>

      {/* Order Confirmation Email Preview */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="bg-muted mb-4 rounded-lg p-4">
          <h3 className="mb-2 text-lg font-semibold">
            Order Confirmation Email Preview
          </h3>
          <p className="text-muted-foreground text-sm">
            This is how order confirmation emails will look when sent to customers
          </p>
        </div>

        <div className="border-border overflow-hidden rounded-lg border">
          <iframe
            ref={orderIframeRef}
            className="h-96 w-full border-0"
            title="Order Confirmation Email Preview"
          />
        </div>

        <div className="bg-muted mt-4 rounded-lg p-4">
          <h4 className="mb-2 font-medium">Preview Details:</h4>
          <ul className="text-muted-foreground space-y-1 text-sm">
            <li>• From: {fromEmail}</li>
            <li>• To: customer@example.com</li>
            <li>• Subject: Order Confirmation</li>
            <li>• Order: PS-2025-001</li>
            <li>• Total: $25.00 (2 items)</li>
            <li>• Customer: Sarah Wilson</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
