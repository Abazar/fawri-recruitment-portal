import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fawri Recruitment Portal",
    template: "%s | Fawri Recruitment",
  },
  description: "Recruitment portal for overseas motorbike rider opportunities.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Fawri Recruitment Portal",
    description: "Recruitment portal for overseas motorbike rider opportunities.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fawri Recruitment Portal",
    description: "Recruitment portal for overseas motorbike rider opportunities.",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
