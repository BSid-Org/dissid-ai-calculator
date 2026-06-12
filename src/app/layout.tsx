import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
