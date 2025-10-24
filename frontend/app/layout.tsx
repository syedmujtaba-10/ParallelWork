import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flight Booking System",
  description: "AI-powered multi-agent flight booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
