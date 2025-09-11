import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";
import ConditionalMouseTrail from "@/components/ConditionalMouseTrail";
import { ScrollProgress } from "@/components/Motion";
import Preloader from "@/components/Preloader";
import { safeJsonLd } from "@/lib/security";

const SITE_DESCRIPTION = "Portfolio of Davide Areias, a full-stack software engineer freelancer specializing in Python, React, and Rust to build scalable web and desktop applications.";

export const metadata: Metadata = {
  metadataBase: new URL("https://areias.it"),
  title: "Davide Areias | Software Engineer",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: "Davide Areias | Software Engineer",
    description: SITE_DESCRIPTION,
    url: "https://areias.it",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://areias.it/"
  },
  "headline": "Davide Areias | Software Engineer Portfolio",
  "description": "Portfolio of Davide Areias, a full-stack software engineer freelancer specializing in Python, React, and Rust to build scalable web and desktop applications.",
  "image": "https://areias.it/og.png",
  "author": {
    "@type": "Person",
    "name": "Davide Areias"
  },
  "publisher": {
    "@type": "Person",
    "name": "Davide Areias",
    "logo": {
      "@type": "ImageObject",
      "url": "https://areias.it/me.png"
    }
  },
  "datePublished": "2024-01-01"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Preloader />
        <ConditionalMouseTrail />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
