import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FootprintCheck — Discover Your Digital Exposure",
  description:
    "Check your digital footprint in 60 seconds. Discover data breaches, exposed accounts, and get a personalized action plan to protect yourself. No sign-up required.",
  keywords: [
    "digital footprint checker",
    "data breach checker",
    "email breach lookup",
    "privacy scanner",
    "cybersecurity",
    "HIBP",
    "OSINT",
    "identity exposure",
  ],
  openGraph: {
    title: "FootprintCheck — Discover Your Digital Exposure",
    description:
      "Scan your email for data breaches and social media exposure in seconds. Free, private, no sign-up.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
