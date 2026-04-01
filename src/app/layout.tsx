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
  title: "Da Nang Tourist Ride - Dich vu xe du lich Da Nang",
  description:
    "Book a ride to explore Da Nang's famous tourist destinations. 4-7 seater vehicles available 24/7. Dragon Bridge, Ba Na Hills, Marble Mountains, Hoi An and more.",
  keywords: [
    "Da Nang",
    "tourist",
    "ride",
    "taxi",
    "Ba Na Hills",
    "Dragon Bridge",
    "Hoi An",
    "Marble Mountains",
    "Vietnam",
    "travel",
  ],
  openGraph: {
    title: "Da Nang Tourist Ride",
    description:
      "Explore Da Nang's famous destinations with our reliable ride service",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
