import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque, Caveat } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS Platform",
  description:
    "Full-stack learning management system built with Next.js, Prisma and PostgreSQL.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col antialiased">
  <Suspense fallback={<div className="h-16 border-b-2 border-ink" />}>
    <Navbar />
  </Suspense>
  <div className="flex-1">{children}</div>
  <Footer />
</body>
    </html>
  );
}
