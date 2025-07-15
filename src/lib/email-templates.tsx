export function createOrderEmailTemplate({
  orderNumber,
  total,
  items,
  customerName,
}: {
  orderNumber: string;
  total: number;
  items: Array<{
    trackName: string;
    licenseType: string;
    unitPrice: number;
  }>;
  customerName?: string;
}) {
  const totalFormatted = (total / 100).toFixed(2);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Prime Studios NYC</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
        <!-- Header -->
        <div style="background-color: #e5a629; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: #0a0a0a; font-size: 24px; font-weight: bold;">
            PRIME STUDIOS NYC
          </h1>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          <!-- Greeting -->
          <div style="margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; color: #e5a629; font-size: 20px; font-weight: 600;">
              Order Confirmation
            </h2>
            <p style="margin: 0; color: #cccccc; font-size: 16px;">
              ${customerName ? `Hi ${customerName},` : "Hi there,"} thank you for your order.
            </p>
          </div>

          <!-- Order Details -->
          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Order Number
              </p>
              <p style="margin: 0; color: #e5a629; font-size: 16px; font-weight: 600;">
                ${orderNumber}
              </p>
            </div>

            <!-- Items -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Items
              </p>
              ${items
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #333333;">
                  <div>
                    <p style="margin: 0 0 2px 0; color: #ffffff; font-size: 14px; font-weight: 500;">
                      ${item.trackName}
                    </p>
                    <p style="margin: 0; color: #999999; font-size: 12px;">
                      ${item.licenseType.replace(/_/g, " ").toUpperCase()}
                    </p>
                  </div>
                  <p style="margin: 0; color: #e5a629; font-size: 14px; font-weight: 600;">
                    $${(item.unitPrice / 100).toFixed(2)}
                  </p>
                </div>
              `,
                )
                .join("")}
            </div>

            <!-- Total -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 2px solid #e5a629;">
              <p style="margin: 0; color: #ffffff; font-size: 16px; font-weight: 600;">
                Total
              </p>
              <p style="margin: 0; color: #e5a629; font-size: 20px; font-weight: 700;">
                $${totalFormatted}
              </p>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #e5a629; font-size: 16px; font-weight: 600;">
              What's Next?
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.6;">
              <li>Your tracks are available for download</li>
              <li>Access your music library in your account</li>
            </ul>
          </div>

          <!-- Contact -->
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #333333;">
            <p style="margin: 0; color: #999999; font-size: 14px;">
              Questions? Contact us at primestudiosnyc@gmail.com
            </p>
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
}

export function createContactEmailTemplate({
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
  return `
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
}

export function createBookingEmailTemplate({
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

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Inquiry - Prime Studios NYC</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
        <!-- Header -->
        <div style="background-color: #e5a629; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: #0a0a0a; font-size: 24px; font-weight: bold;">
            NEW BOOKING INQUIRY
          </h1>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 20px 0; color: #e5a629; font-size: 20px; font-weight: 600;">
              Booking Details
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

            ${
              phone
                ? `<div style=\"margin-bottom: 15px;\">
              <p style=\"margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;\">
                Phone
              </p>
              <p style=\"margin: 0; color: #ffffff; font-size: 16px; font-weight: 500;\">
                <a href=\"tel:${phone}\" style=\"color: #ffffff; text-decoration: none;\">${phone}</a>
              </p>
            </div>`
                : ""
            }

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Services Requested
              </p>
              <p style="margin: 0; color: #e5a629; font-size: 16px; font-weight: 600;">
                ${servicesDisplay}
              </p>
            </div>

            <div style="margin-bottom: 15px;">
              <p style="margin: 0 0 5px 0; color: #999999; font-size: 12px; text-transform: uppercase;">
                Session Details
              </p>
              <div style="margin: 0; color: #cccccc; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                ${sessionDetails}
              </div>
            </div>

            ${
              ipAddress
                ? `<div style=\"margin-top: 20px; padding-top: 15px; border-top: 1px solid #333333;\">
              <p style=\"margin: 0; color: #666666; font-size: 12px;\">
                IP Address: ${ipAddress}
              </p>
            </div>`
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
}

export function createEmailVerificationTemplate({
  url,
}: {
  url: string;
}) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - Prime Studios</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0a;">
        <!-- Header -->
        <div style="background-color: #e5a629; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; color: #0a0a0a; font-size: 24px; font-weight: bold;">
            EMAIL VERIFICATION
          </h1>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="margin: 0 0 20px 0; color: #e5a629; font-size: 20px; font-weight: 600;">
              Welcome to Prime Studios
            </h2>
            
            <p style="margin: 0 0 20px 0; color: #cccccc; font-size: 16px; line-height: 1.6;">
              Thank you for signing up! To complete your registration and access your account, please verify your email address by clicking the button below.
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #e5a629; color: #0a0a0a; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; transition: all 0.3s ease;">
                Verify Email Address
              </a>
            </div>

            <p style="margin: 20px 0 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            <p style="margin: 10px 0 0 0; color: #e5a629; font-size: 14px; word-break: break-all;">
              <a href="${url}" style="color: #e5a629; text-decoration: none;">${url}</a>
            </p>
          </div>

          <div style="background-color: #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #e5a629; font-size: 16px; font-weight: 600;">
              What's Next?
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #cccccc; font-size: 14px; line-height: 1.6;">
              <li>Verify your email to activate your account</li>
              <li>Access your dashboard and manage your music</li>
              <li>Browse and purchase tracks from our library</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #333333;">
          <p style="margin: 0 0 10px 0; color: #666666; font-size: 12px;">
            If you didn't create an account with Prime Studios, you can safely ignore this email.
          </p>
          <p style="margin: 0; color: #666666; font-size: 12px;">
            © 2025 Prime Studios
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
