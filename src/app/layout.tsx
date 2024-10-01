import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/nav";

// const blackPearl = localFont({
//   src: "./fonts/blackpearl.ttf",
//   variable: "--font-blackpearl",
// });

export const metadata: Metadata = {
  title: "Low Skies | Hack Club",
  description: "Hack Club's Low Skies event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${/*blackPearl.variable*/ 1} antialiased mt-14 overflow-hidden`}
      >
        {children}
        <Nav />
        <SpeedInsights />
      </body>
    </html>
  );
}
