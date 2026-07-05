import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [...site.keywords],
  openGraph: {
    title: site.title,
    description:
      "An intelligent exterior water-defense system for mountain homes exposed to ember storms, wind-driven fires, and evacuation uncertainty.",
    url: site.url,
    siteName: site.name,
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 2000,
        height: 1333,
        alt: "Pine forest and granite near Lake Tahoe and Reno, Northern Nevada",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.titleShort,
    description: `Intelligent exterior water-defense system for ${site.region.label}.`,
    images: ["/images/hero-bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} scroll-smooth`}>
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
