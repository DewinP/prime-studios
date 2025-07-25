import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCProvider } from "@/trpc/react";
import { Header } from "@/components/shared/nav/header";
import AudioPlayerContainer from "@/components/shared/audio/AudioPlayerContainer";
import { ThemeProvider } from "@/components/shared/theme/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Prime Studios",
  description: "Prime Studios NYC - Your Premier Recording Studio",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/byz4qug.css" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>
          <TRPCProvider>
            <AuthProvider>
              <div className="bg-gradient-dark min-h-screen w-full flex-1 flex-col items-center justify-center">
                <Header />
                <div className="supports-[backdrop-filter]:bg-background/60 from-background/80 to-background-secondary overflow-y-hidden bg-gradient-to-b">
                  <main className="mx-auto h-full max-w-7xl px-4 py-6">
                    {children}
                  </main>
                </div>
                <AudioPlayerContainer />
              </div>
              <Toaster />
            </AuthProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
