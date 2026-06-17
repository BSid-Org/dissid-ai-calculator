import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font — no render-blocking third-party request.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Siddhant Badola — Senior AI / Agentic Systems Engineer",
  description:
    "Production agent fleets, MCP integrations, voice/vision pipelines, and AI hardware. Open to full-time and fractional engagements.",
  openGraph: {
    title: "Siddhant Badola — Senior AI / Agentic Systems Engineer",
    description:
      "Production agent fleets, MCP integrations, voice/vision pipelines, and AI hardware. Open to full-time and fractional engagements.",
    url: "https://dissid.ai",
    siteName: "DISSID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
