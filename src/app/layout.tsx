import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Preloader from "@/components/Preloader";
import { MouseTrail, ScrollProgress } from "@/components/Motion";

export const metadata: Metadata = {
  metadataBase: new URL("https://areias.it"),
  title: "Davide Areias | Software Engineer",
  description:
    "Portfolio of Davide Areias, a full-stack software engineer specializing in Python, React, and Rust to build scalable web and desktop applications.",
  openGraph: {
    title: "Davide Areias | Software Engineer",
    description:
      "Portfolio of Davide Areias, a full-stack software engineer specializing in Python, React, and Rust to build scalable web and desktop applications.",
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
  "description": "Portfolio of Davide Areias, a full-stack software engineer specializing in Python, React, and Rust to build scalable web and desktop applications.",
  "image": "https://areias.it/og-image.png",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <Preloader />
        <MouseTrail />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
