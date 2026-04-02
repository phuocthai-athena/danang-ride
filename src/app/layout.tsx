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
  metadataBase: new URL("https://travelyourway.vercel.app"),
  title: {
    default:
      "Travel Your Way - Da Nang Private Car & Tour Service | Dịch vụ xe du lịch Đà Nẵng",
    template: "%s | Travel Your Way",
  },
  description:
    "Private car service & tours in Da Nang, Hoi An, Hue. Airport transfers, Ba Na Hills, Marble Mountains, My Son Sanctuary. Available 24/7 with 4-7 seater vehicles. Dịch vụ xe du lịch Đà Nẵng - Hội An - Huế.",
  keywords: [
    "Da Nang private car",
    "Da Nang tour",
    "Da Nang taxi",
    "Da Nang airport transfer",
    "Hoi An tour",
    "Hue tour",
    "Ba Na Hills",
    "Marble Mountains",
    "My Son Sanctuary",
    "Vietnam travel",
    "Da Nang travel service",
    "xe du lịch Đà Nẵng",
    "thuê xe Đà Nẵng",
    "tour Đà Nẵng",
    "xe sân bay Đà Nẵng",
  ],
  openGraph: {
    title: "Travel Your Way - Da Nang Private Car & Tour Service",
    description:
      "Your trusted local driver in Da Nang. Private tours to Ba Na Hills, Hoi An, Hue & more. Comfortable rides, flexible schedules, 24/7 availability.",
    type: "website",
    locale: "vi_VN",
    url: "https://travelyourway.vercel.app",
    siteName: "Travel Your Way",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Travel Your Way - Private car and tour service in Da Nang, Vietnam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Your Way - Da Nang Private Car & Tour Service",
    description:
      "Your trusted local driver in Da Nang. Private tours to Ba Na Hills, Hoi An, Hue & more. Comfortable rides, 24/7 availability.",
    images: ["/images/og-image.jpg"],
  },
  alternates: {
    canonical: "https://travelyourway.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
