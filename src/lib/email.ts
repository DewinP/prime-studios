import { Resend } from "resend";
import { env } from "@/env";
import {
  createOrderEmailTemplate,
  createBookingEmailTemplate,
} from "./email-templates";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendOrderEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: "Prime Studios NYC <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}

export async function sendContactEmail({
  name,
  email,
  subject,
  message,
  ipAddress,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission - Prime Studios NYC</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
        <!-- Header -->
        <div style="background-color: #e5a629; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: #0a0a0a; font-size: 24px; font-weight: bold;">
            NEW CONTACT INQUIRY
          </h1>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 20px 0; color: #e5a629; font-size: 20px; font-weight: 600;">
              Contact Details
            </h2>
            
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Name
              </p>
              <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 500;">
                ${name}
              </p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Email
              </p>
              <p style="margin: 0; color: #e5a629; font-size: 16px; font-weight: 500;">
                <a href="mailto:${email}" style="color: #e5a629; text-decoration: none;">${email}</a>
              </p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Subject
              </p>
              <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 500;">
                ${subject}
              </p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Message
              </p>
              <div style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                ${message}
              </div>
            </div>

            ${
              ipAddress
                ? `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #333333;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                IP Address: ${ipAddress}
              </p>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #333333;">
          <p style="margin: 0; color: #666666; font-size: 12px;">
            © 2025 Prime Studios NYC
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return resend.emails.send({
    from: "Prime Studios NYC <onboarding@resend.dev>",
    to: "inquiries@primestudiosnyc.com",
    subject: `New Contact Form: ${subject}`,
    html,
    replyTo: email,
  });
}

export async function sendBookingEmail({
  name,
  email,
  phone,
  services,
  sessionDetails,
  ipAddress,
}: {
  name: string;
  email: string;
  phone?: string;
  services: string[];
  sessionDetails: string;
  ipAddress?: string;
}) {
  const serviceLabels: Record<string, string> = {
    recording: "Recording",
    mixing: "Mixing",
    mastering: "Mastering",
    production: "Production",
  };
  const servicesDisplay = services.map((s) => serviceLabels[s] ?? s).join(", ");

  const html = createBookingEmailTemplate({
    name,
    email,
    phone,
    services,
    sessionDetails,
    ipAddress,
  });

  return resend.emails.send({
    from: "Prime Studios NYC <onboarding@resend.dev>",
    to: "inquiries@primestudiosnyc.com",
    subject: `New Booking Inquiry: ${servicesDisplay}`,
    html,
    replyTo: email,
  });
}

export { createOrderEmailTemplate };
