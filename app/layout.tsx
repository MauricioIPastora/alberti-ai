/* =============================================================================
   ALBERTI AI - ROOT LAYOUT
   Neobrutalist Design integrated with existing structure
   ============================================================================= */

import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// Geist font family for neobrutalist aesthetic
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alberti AI - Job Tracker Pro",
  description:
    "Track job applications, optimize your resume, and manage referrals with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
