import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/nav";

const mainFont = localFont({
  src: "../../public/fonts/ADLaMDisplay-Regular.ttf",
  variable: "--font-main",
});

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
      <body className={`${mainFont.variable} antialiased mt-14`}>
        {children}
        <Nav />
        <SpeedInsights />
      </body>
    </html>
  );
}
