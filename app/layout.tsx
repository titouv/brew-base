import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistSerif } from "geist/font/serif/variable";
import { GeistMono } from "geist/font/mono";
import { GeistPixelSquare } from "geist/font/pixel/square";
import "./globals.css";

const fontVariables = [
  GeistSans.variable,
  GeistSerif.variable,
  GeistMono.variable,
  GeistPixelSquare.variable,
].join(" ");

export const metadata: Metadata = {
  title: "BrewBase",
  description:
    "Discover and install Homebrew packages effortlessly with BrewBase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body
        className={`antialiased font-sans overflow-y-scroll`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
