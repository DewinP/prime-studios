"use client";

import { useEffect, useRef } from "react";
import {
  createContactEmailTemplate,
  createBookingEmailTemplate,
} from "@/lib/email-templates";

interface EmailPreviewProps {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function EmailPreview({
  name = "John Doe",
  email = "john@example.com",
  subject = "Studio Inquiry",
  message = "Hi, I'm interested in recording some tracks at your studio. Could you please provide more information about your rates and availability?",
}: EmailPreviewProps) {
  const contactIframeRef = useRef<HTMLIFrameElement>(null);
  const bookingIframeRef = useRef<HTMLIFrameElement>(null);

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
  }, [name, email, subject, message]);

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
            inquiries@primestudiosnyc.com
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
            <li>• From: inquiries@primestudiosnyc.com</li>
            <li>• To: inquiries@primestudiosnyc.com</li>
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
            inquiries@primestudiosnyc.com
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
            <li>• From: inquiries@primestudiosnyc.com</li>
            <li>• To: inquiries@primestudiosnyc.com</li>
            <li>• Reply-To: mike@example.com</li>
            <li>• Subject: New Booking Inquiry: Recording</li>
            <li>• Sender: Mike Johnson (mike@example.com)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
