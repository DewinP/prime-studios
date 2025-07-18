"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "@/trpc/react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);

  const contactMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message. Please try again.");
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
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject");
      return false;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return false;
    }
    if (formData.message.length < 10) {
      toast.error("Message must be at least 10 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam protection: Check if form was submitted recently
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    const minTimeBetweenSubmissions = 30000; // 30 seconds

    if (timeSinceLastSubmission < minTimeBetweenSubmissions) {
      const remainingTime = Math.ceil(
        (minTimeBetweenSubmissions - timeSinceLastSubmission) / 1000,
      );
      toast.error(
        `Please wait ${remainingTime} seconds before submitting another message`,
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLastSubmissionTime(now);
    contactMutation.mutate(formData);
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
          Contact
        </h1>
        <div className="from-primary to-primary/80 mx-auto mb-8 h-1 w-24 rounded-full bg-gradient-to-r" />
        <p className="text-muted-foreground mb-10 text-center text-lg font-medium">
          Get in touch with us for any questions or inquiries
        </p>

        {/* Contact Info Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card className="bg-background/60 border-border/50 hover:bg-background/80 group backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                <Mail className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="font-medium">
                  primestudiosnyc@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/60 border-border/50 hover:bg-background/80 group backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                <MapPin className="text-primary h-5 w-5" />
              </div>
                              <div>
                  <p className="text-muted-foreground text-sm">Location</p>
                  <p className="font-medium">1431 Beach Ave, Bronx, NY 10460</p>
                </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-background/80 border-border/30 flex flex-col gap-7 rounded-2xl border p-8 shadow-xl"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                disabled={contactMutation.isPending}
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
                disabled={contactMutation.isPending}
                className="bg-background/40 border-border/50 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="subject"
              className="mb-2 flex items-center gap-1 py-2 text-sm font-medium"
            >
              <span className="text-primary">
                <Mail className="inline-block h-4 w-4" />
              </span>{" "}
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              placeholder="What's this about?"
              value={formData.subject}
              onChange={handleInputChange}
              required
              disabled={contactMutation.isPending}
              className="bg-background/40 border-border/50 focus:border-primary"
            />
          </div>

          <div>
            <Label
              htmlFor="message"
              className="mb-2 flex items-center gap-1 py-2 text-sm font-medium"
            >
              <span className="text-primary">
                <Mail className="inline-block h-4 w-4" />
              </span>{" "}
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your question or inquiry..."
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              required
              disabled={contactMutation.isPending}
              className="bg-background/40 border-border/50 focus:border-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={contactMutation.isPending}
            className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground group mt-2 w-full rounded-full bg-gradient-to-r py-3 text-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
          >
            {contactMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </main>
  );
}
