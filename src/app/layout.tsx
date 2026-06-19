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
  metadataBase: new URL("https://dissid.ai"),
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Siddhant Badola — Senior AI / Agentic Systems Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siddhant Badola — Senior AI / Agentic Systems Engineer",
    description:
      "Production agent fleets, MCP integrations, voice/vision pipelines, and AI hardware. Open to full-time and fractional engagements.",
    images: ["/og-image.jpg"],
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=add_circle,apartment,arrow_back,arrow_forward,auto_awesome,calendar_month,campaign,check_circle,close,cloud,code,construction,corporate_fare,description,diversity_3,edit_note,error,event,expand_more,favorite,group,groups,inventory_2,menu,person,query_stats,rocket_launch,savings,schedule,shopping_cart,support_agent,table_chart,trending_up,work&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
