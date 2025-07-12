import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { sendBookingEmail } from "@/lib/email";

const bookingSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  services: z
    .array(z.enum(["recording", "mixing", "mastering", "production"]))
    .min(1, "Select at least one service"),
  sessionDetails: z
    .string()
    .min(20, "Session details must be at least 20 characters")
    .max(2000, "Session details are too long"),
});

export const bookingRouter = createTRPCRouter({
  submit: publicProcedure
    .input(bookingSchema)
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

      const messageContent =
        `${input.services.join(", ")} ${input.sessionDetails}`.toLowerCase();

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(messageContent)) {
          throw new Error("Booking request contains suspicious content");
        }
      }

      // Get IP address for tracking
      const headers = ctx.headers;
      const ip =
        headers.get("x-forwarded-for") ?? headers.get("x-real-ip") ?? "unknown";

      // Send email
      await sendBookingEmail({
        name: input.name,
        email: input.email,
        phone: input.phone ?? undefined,
        services: input.services,
        sessionDetails: input.sessionDetails,
        ipAddress: ip,
      });

      return { success: true, message: "Booking request sent successfully" };
    }),
});
