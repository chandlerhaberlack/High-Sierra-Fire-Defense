import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const siteUrl = "https://highsierrafiredefense.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title:
    "High Sierra Fire Defense | Wildfire Defense for Reno, Tahoe & Sierra Foothill Homes",
  description:
    "An intelligent exterior wildfire defense system for mountain homes in Reno, Tahoe, Truckee, and the Sierra Nevada. Join the early access list for updates and pilot opportunities.",
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
      "High Sierra Fire Defense | Wildfire Defense for Reno, Tahoe & Sierra Foothill Homes",
    description:
      "An intelligent exterior water-defense system for mountain homes exposed to ember storms, wind-driven fires, and evacuation uncertainty.",
    url: siteUrl,
    siteName: "High Sierra Fire Defense",
    images: [
      {
        url: "/images/hero-bg.jpg",
        width: 1920,
        height: 1080,
        alt: "Sierra Nevada mountain home exterior wildfire defense system concept",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "High Sierra Fire Defense | Wildfire Defense for Mountain Homes",
    description:
      "Intelligent exterior water-defense system for Reno, Tahoe, Truckee, and Sierra foothill homes.",
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
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
