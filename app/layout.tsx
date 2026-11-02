import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrewBase: pick Homebrew casks, copy one command",
  description:
    "Browse the most installed Homebrew casks, pick the apps you need and copy a single brew install command.",
  applicationName: "BrewBase",
  openGraph: {
    title: "BrewBase",
    description:
      "Pick the Homebrew casks you need and copy a single brew install command.",
    type: "website",
    siteName: "BrewBase",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#17130e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-brew focus:bg-brew-code focus:px-4 focus:py-2 focus:text-brew-text"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
