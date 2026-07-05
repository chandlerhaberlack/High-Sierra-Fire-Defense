import { site, faqItems } from "@/lib/site";

const areaServed = [
  { "@type": "City", name: "Reno", containedInPlace: { "@type": "State", name: "Nevada" } },
  { "@type": "City", name: "Carson City", containedInPlace: { "@type": "State", name: "Nevada" } },
  { "@type": "City", name: "Truckee", containedInPlace: { "@type": "State", name: "California" } },
  { "@type": "Place", name: "Lake Tahoe" },
  { "@type": "Place", name: "Northern Nevada" },
];

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.shortDescription,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    areaServed,
    knowsAbout: [
      "Wildfire defense",
      "Exterior wildfire sprinkler systems",
      "Home wildfire protection",
      "Wildfire mitigation",
      "Defensible space water systems",
      "Fire retardant home defense",
    ],
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${site.name} Exterior Wildfire Defense System`,
    serviceType: "Wildfire mitigation system",
    description: site.description,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${site.url}/#signup`,
      name: "Early access waitlist",
    },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: site.title,
    description: `${site.shortDescription} Join the early access list.`,
    about: {
      "@type": "Thing",
      name: "Residential wildfire mitigation and exterior pre-wetting systems",
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      {[organization, service, webPage, faqPage].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
