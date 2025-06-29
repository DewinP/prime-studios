import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Twitter, Instagram, Facebook, Linkedin, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex-col justify-center bg-gray-800 text-white">
      <div className="max-h-10xl mx-auto flex min-h-screen w-full flex-col rounded border-r border-l md:flex-row">
        {/* Socials Left */}
        <div className="flex min-h-[340px] w-full flex-col items-center justify-center gap-6 bg-gradient-to-b p-8 md:w-1/3">
          <h2 className="mb-2 text-lg font-bold">Connect with us</h2>
          <div className="flex w-full max-w-xs flex-col items-start gap-4">
            <a
              href="mailto:hello@yourcompany.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email"
              className="hover:bg-primary/10 flex w-full items-center gap-3 rounded px-3 py-2 transition-colors"
            >
              <Mail className="h-7 w-7" />
              <span className="text-base font-medium">Email</span>
              <span className="ml-2 text-sm">hello@yourcompany.com</span>
            </a>
            <a
              href="https://twitter.com/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:bg-primary/10 flex w-full items-center gap-3 rounded px-3 py-2 transition-colors"
            >
              <Twitter className="h-7 w-7" />
              <span className="text-base font-medium">Twitter</span>
              <span className="ml-2 text-sm">@yourcompany</span>
            </a>
            <a
              href="https://instagram.com/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:bg-primary/10 flex w-full items-center gap-3 rounded px-3 py-2 transition-colors"
            >
              <Instagram className="h-7 w-7" />
              <span className="text-base font-medium">Instagram</span>
              <span className="ml-2 text-sm">@yourcompany</span>
            </a>
            <a
              href="https://facebook.com/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:bg-primary/10 flex w-full items-center gap-3 rounded px-3 py-2 transition-colors"
            >
              <Facebook className="h-7 w-7" />
              <span className="text-base font-medium">Facebook</span>
              <span className="ml-2 text-sm">yourcompany</span>
            </a>
            <a
              href="https://linkedin.com/company/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:bg-primary/10 flex w-full items-center gap-3 rounded px-3 py-2 transition-colors"
            >
              <Linkedin className="h-7 w-7" />
              <span className="text-base font-medium">LinkedIn</span>
              <span className="ml-2 text-sm">yourcompany</span>
            </a>
          </div>
        </div>
        {/* Form Right */}
        <div className="bg-background flex min-h-[340px] flex-1 flex-col justify-center p-8">
          <h1 className="mb-2 text-center text-2xl font-bold md:text-left">
            Contact Us
          </h1>
          <p className="text-muted-foreground mb-6 text-center md:text-left">
            We'd love to hear from you! Fill out the form below.
          </p>
          <form className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <Input
                type="text"
                placeholder="First name"
                required
                className="flex-1"
              />
              <Input
                type="text"
                placeholder="Last name"
                required
                className="flex-1"
              />
            </div>
            <Input type="email" placeholder="Email" required />
            <Textarea placeholder="Your message" rows={4} required />
            <Button
              type="submit"
              className="bg-primary w-full px-8 font-semibold text-white md:w-auto"
            >
              Send message
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
