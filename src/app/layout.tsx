import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";
import { MouseTrail, ScrollProgress } from "@/components/Motion";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Preloader />
        <MouseTrail />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
