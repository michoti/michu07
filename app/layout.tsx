import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: { default: 'Michu07 — Luxury Timepieces', template: '%s | Michu07' },
  description: 'Curating the world\'s most exceptional timepieces for discerning collectors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
        </body>
    </html>
  );
}
