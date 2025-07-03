import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="from-background via-background/95 to-muted/20 mx-auto flex min-h-screen max-w-7xl justify-center bg-gradient-to-br px-4 pt-10">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column - Contact Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1
              className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent lg:text-5xl"
              style={{ fontFamily: "alfarn-2, sans-serif" }}
            >
              Get In Touch
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Ready to start your next project? We&apos;d love to hear from you
              and help bring your musical vision to life.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              Whether you&apos;re looking to record, mix, or master your music,
              our team is here to support your creative journey.
            </p>
          </div>

          {/* Contact Information Cards */}
          <div className="space-y-4">
            <Card className="bg-background/60 border-border/50 hover:bg-background/80 group w-full backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                  <Mail className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium">hello@primestudios.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/60 border-border/50 hover:bg-background/80 group w-full backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                  <MapPin className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Location</p>
                  <p className="font-medium">1234 Studio Lane, City, Country</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/60 border-border/50 hover:bg-background/80 group w-full backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-primary/10 group-hover:bg-primary/20 rounded-lg p-2 transition-colors">
                  <Phone className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Media Links */}
          <div className="space-y-3">
            <h3 className="text-foreground text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/primestudios"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/60 border-border/50 hover:bg-background/80 group rounded-lg border p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <Twitter className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://instagram.com/primestudios"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/60 border-border/50 hover:bg-background/80 group rounded-lg border p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <Instagram className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://facebook.com/primestudios"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/60 border-border/50 hover:bg-background/80 group rounded-lg border p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <Facebook className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://linkedin.com/company/primestudios"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-background/60 border-border/50 hover:bg-background/80 group rounded-lg border p-3 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
              >
                <Linkedin className="text-primary h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-foreground text-3xl font-bold">Send Message</h2>
            <p className="text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you as soon as
              possible.
            </p>
          </div>

          <Card className="bg-background/60 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your first name"
                      required
                      className="bg-background/40 border-border/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-foreground text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter your last name"
                      required
                      className="bg-background/40 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="bg-background/40 border-border/50 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-foreground text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                    className="bg-background/40 border-border/50 focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground group w-full bg-gradient-to-r py-3 font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
