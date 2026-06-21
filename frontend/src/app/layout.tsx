import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Footprint Checker",
  description:
    "Check your digital footprint in 60 seconds. Discover data breaches, exposed accounts, and get actionable steps to protect yourself.",
  keywords: [
    "digital footprint",
    "data breach checker",
    "email breach",
    "privacy",
    "security",
    "OSINT",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
