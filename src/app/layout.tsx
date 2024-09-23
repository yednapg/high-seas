import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const blackPearl = localFont({
  src: "./fonts/blackpearl.ttf",
  variable: "--font-blackpearl",
});

export const metadata: Metadata = {
  title: "High Seas | Hack Club",
  description: "Hack Club's High Seas event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${blackPearl.variable} antialiased`}>{children}</body>
    </html>
  );
}
