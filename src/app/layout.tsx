import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multilingual Mandi - मल्टीलिंगुअल मंडी",
  description: "Voice-first multilingual marketplace for agricultural commodities. Get real-time prices, negotiate with AI, and trade in Hindi, English, Tamil, Telugu, and Kannada.",
  keywords: ["mandi", "agriculture", "prices", "multilingual", "voice", "AI", "negotiation", "farming", "commodities"],
  authors: [{ name: "Multilingual Mandi Team" }],
  creator: "Multilingual Mandi",
  publisher: "Multilingual Mandi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'hi-IN': '/hi',
      'en-IN': '/en',
      'ta-IN': '/ta',
      'te-IN': '/te',
      'kn-IN': '/kn',
    },
  },
  openGraph: {
    title: "Multilingual Mandi - मल्टीलिंगुअल मंडी",
    description: "Voice-first multilingual marketplace for agricultural commodities",
    url: 'http://localhost:3000',
    siteName: 'Multilingual Mandi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Multilingual Mandi - Voice-first agricultural marketplace',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Multilingual Mandi - मल्टीलिंगुअल मंडी",
    description: "Voice-first multilingual marketplace for agricultural commodities",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mandi',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#15803d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mandi" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#15803d" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}