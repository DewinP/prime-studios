"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Send, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/trpc/react";

const SERVICES = [
  { value: "recording", label: "Recording" },
  { value: "mixing", label: "Mixing" },
  { value: "mastering", label: "Mastering" },
  { value: "production", label: "Production" },
];

type ServiceType = "recording" | "mixing" | "mastering" | "production";

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  services: ServiceType[];
  sessionDetails: string;
}

export default function BookPage() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    services: [],
    sessionDetails: "",
  });
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);

  const bookingMutation = api.booking.submit.useMutation({
    onSuccess: () => {
      toast.success(
        "Booking request sent successfully! We'll contact you soon to confirm your session.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        services: [],
        sessionDetails: "",
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to send booking request. Please try again.",
      );
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (service: ServiceType) => {
    setFormData((prev) => {
      const exists = prev.services.includes(service);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (formData.services.length === 0) {
      toast.error("Please select at least one service");
      return false;
    }
    if (!formData.sessionDetails.trim()) {
      toast.error("Please provide session details");
      return false;
    }
    if (formData.sessionDetails.length < 20) {
      toast.error("Session details must be at least 20 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    const minTimeBetweenSubmissions = 30000;
    if (timeSinceLastSubmission < minTimeBetweenSubmissions) {
      const remainingTime = Math.ceil(
        (minTimeBetweenSubmissions - timeSinceLastSubmission) / 1000,
      );
      toast.error(
        `Please wait ${remainingTime} seconds before submitting another booking request`,
      );
      return;
    }
    if (!validateForm()) return;
    setLastSubmissionTime(now);
    bookingMutation.mutate(formData);
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col overflow-x-hidden px-4 pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1
          className="mb-2 text-center text-4xl font-extrabold tracking-tight"
          style={{ fontFamily: "alfarn-2" }}
        >
          Booking
        </h1>
        <div className="from-primary to-primary/80 mx-auto mb-8 h-1 w-24 rounded-full bg-gradient-to-r" />
        <p className="text-muted-foreground mb-10 text-center text-lg font-medium">
          Use The Form Below To Get In Touch With Us
        </p>
        <form
          onSubmit={handleSubmit}
          className="bg-background/80 border-border/30 flex flex-col gap-7 rounded-2xl border p-8 shadow-xl"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <Label
                htmlFor="name"
                className="mb-2 flex items-center gap-1 py-2 text-sm font-medium"
              >
                <span className="text-primary">
                  <Mail className="inline-block h-4 w-4" />
                </span>{" "}
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={bookingMutation.isPending}
                className="bg-background/40 border-border/50 focus:border-primary"
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="mb-2 flex items-center gap-1 py-2 text-sm font-medium"
              >
                <span className="text-primary">
                  <Mail className="inline-block h-4 w-4" />
                </span>{" "}
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={bookingMutation.isPending}
                className="bg-background/40 border-border/50 focus:border-primary"
              />
            </div>
            <div>
              <Label
                htmlFor="phone"
              
                className="mb-2 flex items-center gap-1 py-2 text-sm font-medium"
              >
                <span className="text-primary">
                  <Mail className="inline-block h-4 w-4" />
                </span>{" "}
                Phone Number
              </Label>
              <Input
               required
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={bookingMutation.isPending}
                className="bg-background/40 border-border/50 focus:border-primary"
              />
            </div>
          </div>
          <div>
            <Label className="mb-3 flex items-center gap-1 py-2 text-sm font-medium">
              <span className="text-primary">
                <Mail className="inline-block h-4 w-4" />
              </span>{" "}
              Select A Service <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-4 px-1">
              {SERVICES.map((service) => (
                <label
                  key={service.value}
                  className="flex cursor-pointer items-center gap-2 select-none"
                >
                  <Checkbox
                    checked={formData.services.includes(
                      service.value as ServiceType,
                    )}
                    onCheckedChange={() =>
                      handleServiceChange(service.value as ServiceType)
                    }
                    disabled={bookingMutation.isPending}
                  />
                  <span>{service.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label
              htmlFor="sessionDetails"
              className="mb-3 flex items-center gap-1 py-2 text-sm font-medium"
            >
              <span className="text-primary">
                <Mail className="inline-block h-4 w-4" />
              </span>{" "}
              Session Date/Time/Details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="sessionDetails"
              name="sessionDetails"
              placeholder="Tell us about your project, preferred dates/times, and any specific requirements..."
              rows={5}
              value={formData.sessionDetails}
              onChange={handleInputChange}
              required
              disabled={bookingMutation.isPending}
              className="bg-background/40 border-border/50 focus:border-primary resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={bookingMutation.isPending}
            className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground group mt-2 w-full rounded-full bg-gradient-to-r py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          >
            {bookingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Request...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                Submit Email
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
