import type { Metadata } from "next";
import { Silkscreen } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/alberti-components/global/nav-bar";

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Alberti AI",
  description: "Optimize your resume and apply to jobs with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={silkscreen.variable}>
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>
        {children}
      </body>
    </html>
  );
}
