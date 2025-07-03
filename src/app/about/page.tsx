import Image from "next/image";
import { MapPin, Mail, Music, Mic, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="from-background via-background/95 to-muted/20 mx-auto flex min-h-screen max-w-7xl justify-center bg-gradient-to-br px-4 pt-10">
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column - Image with Effects */}
        <div className="group relative">
          <div className="from-primary/20 via-primary/10 to-primary/20 absolute rounded-2xl bg-gradient-to-r opacity-75 blur-lg transition duration-1000 group-hover:opacity-100"></div>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/studio-equipment.jpg"
              alt="Prime Studio Inside"
              width={800}
              height={600}
              className="h-[400px] w-full transform object-cover transition-transform duration-700 group-hover:scale-105 lg:h-[500px]"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

            {/* Floating icons */}
            <div className="bg-background/80 absolute top-4 left-4 rounded-full p-2 shadow-lg backdrop-blur-sm">
              <Music className="text-primary h-5 w-5" />
            </div>
            <div className="bg-background/80 absolute top-4 right-4 rounded-full p-2 shadow-lg backdrop-blur-sm">
              <Mic className="text-primary h-5 w-5" />
            </div>
            <div className="bg-background/80 absolute bottom-4 left-4 rounded-full p-2 shadow-lg backdrop-blur-sm">
              <Headphones className="text-primary h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1
              className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent lg:text-5xl"
              style={{ fontFamily: "alfarn-2, sans-serif" }}
            >
              Prime Studios
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Where creativity meets technology. Our state-of-the-art recording
              studio provides the perfect environment for artists to bring their
              vision to life.
            </p>
            <p className="text-foreground/80 text-lg leading-relaxed">
              From intimate acoustic sessions to full-band recordings, we offer
              professional-grade equipment and experienced engineers to capture
              your sound with pristine quality.
            </p>
          </div>

          {/* Contact Cards - Full Width Stacked */}
          <div className="space-y-4">
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
                  <Mail className="text-primary h-5 w-5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="font-medium">hello@primestudios.com</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="bg-background/40 border-border/30 rounded-lg border p-4 text-center backdrop-blur-sm">
              <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                <Music className="text-primary h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Recording</p>
            </div>
            <div className="bg-background/40 border-border/30 rounded-lg border p-4 text-center backdrop-blur-sm">
              <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                <Mic className="text-primary h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Mixing</p>
            </div>
            <div className="bg-background/40 border-border/30 rounded-lg border p-4 text-center backdrop-blur-sm">
              <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                <Headphones className="text-primary h-6 w-6" />
              </div>
              <p className="text-sm font-medium">Mastering</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
