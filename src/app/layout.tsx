import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import localFont from "next/font/local";
import "./globals.css";

// const blackPearl = localFont({
//   src: "./fonts/blackpearl.ttf",
//   variable: "--font-blackpearl",
// });

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
      <SpeedInsights />
      <body className={`${/*blackPearl.variable*/ 1} antialiased`}>
        {children}
      </body>
    </html>
  );
}
