import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { SITE_URL } from "@/lib/site";

import "./globals.css";

// Inter is shared by both brands, so it loads here. Brand-specific display
// faces (JetBrains Mono, Space Grotesk) are attached in the route-group
// layouts so a visitor only ever downloads the ones their page uses.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  // Shared with robots.ts and sitemap.ts so the three can't drift apart.
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Next 16 no longer neutralizes `scroll-behavior: smooth` during route
      // transitions unless this attribute opts back in.
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
