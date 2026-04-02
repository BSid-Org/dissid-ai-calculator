import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DISSID — AI Automation for Small Businesses",
  description:
    "Custom AI agents that cut operational costs by 40-70%. Serving businesses in Kitchener-Waterloo and across Ontario.",
  openGraph: {
    title: "DISSID — AI Automation for Small Businesses",
    description:
      "Custom AI agents that cut operational costs by 40-70%. Serving businesses in Kitchener-Waterloo and across Ontario.",
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
