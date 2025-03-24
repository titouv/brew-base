import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "BrewBase",
  description: "Discover and install Homebrew packages effortlessly with BrewBase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
