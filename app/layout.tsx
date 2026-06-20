import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
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

const siteUrl = "https://highsierrafiredefense.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "High Sierra Fire Defense | Wildfire Defense for Reno, Tahoe & Northern Nevada",
  description:
    "An intelligent exterior wildfire defense system for mountain homes in Reno, Tahoe, Truckee, and Northern Nevada. Join the early access list for updates and pilot opportunities.",
  keywords: [
    "wildfire defense Reno",
    "wildfire sprinkler system Tahoe",
    "wildfire sprinkler system Reno",
    "home wildfire protection Reno",
    "home wildfire protection Tahoe",
    "exterior wildfire sprinkler system",
    "wildfire mitigation system Nevada",
    "defensible space water system",
    "smart wildfire defense system",
    "roof sprinkler wildfire system",
    "home wildfire protection Truckee",
    "exterior wildfire mitigation Nevada",
  ],
  openGraph: {
    title:
      "High Sierra Fire Defense | Wildfire Defense for Reno, Tahoe & Northern Nevada",
    description:
      "An intelligent exterior water-defense system for mountain homes exposed to ember storms, wind-driven fires, and evacuation uncertainty.",
    url: siteUrl,
    siteName: "High Sierra Fire Defense",
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
    title: "High Sierra Fire Defense | Wildfire Defense for Mountain Homes",
    description:
      "Intelligent exterior water-defense system for Reno, Tahoe, Truckee, and Northern Nevada.",
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
