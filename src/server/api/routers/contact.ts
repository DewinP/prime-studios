import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendContactEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(contactSchema)
    .mutation(async ({ input, ctx }) => {
      // Basic spam protection: Check for suspicious patterns
      const suspiciousPatterns = [
        /buy.*viagra/i,
        /casino/i,
        /loan/i,
        /credit.*card/i,
        /free.*money/i,
        /click.*here/i,
        /http:\/\//i, // Block HTTP links (should use HTTPS)
      ];

      const messageContent = `${input.subject} ${input.message}`.toLowerCase();

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(messageContent)) {
          throw new Error("Message contains suspicious content");
        }
      }

      // Get IP address for tracking
      const headers = ctx.headers;
      const ip =
        headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "unknown";

      // Send email
      await sendContactEmail({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        ipAddress: ip,
      });

      return { success: true, message: "Message sent successfully" };
    }),
});
