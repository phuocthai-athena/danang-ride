import ClientFlipBook from "@/components/ClientFlipBook";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Travel Your Way",
  description:
    "Private car service & tours in Da Nang, Hoi An, Hue. Airport transfers and sightseeing tours available 24/7.",
  url: "https://travelyourway.vercel.app",
  telephone: "+84773306310",
  areaServed: [
    { "@type": "City", name: "Da Nang" },
    { "@type": "City", name: "Hoi An" },
    { "@type": "City", name: "Hue" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Da Nang",
    addressCountry: "VN",
  },
  priceRange: "$$",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientFlipBook />
    </main>
  );
}
