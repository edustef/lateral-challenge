import type { Metadata } from "next";
import { fraunces, inter, ibmPlexMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wanderly — Unique Stays",
  description: "Discover unique stays through a vibe-first experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
