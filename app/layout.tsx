import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthProvider from "./AuthProvider";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./dashboard/components/ThemeProvider";
import {Outfit} from "next/font/google";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const OutfitFont = Outfit({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-geist-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Tchidash",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`light ${OutfitFont.className} text-black/80 ${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            value={{
              light: "light",
            }}
            disableTransitionOnChange
          >
            <TooltipProvider>
              <Providers>{children}</Providers>
            </TooltipProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
