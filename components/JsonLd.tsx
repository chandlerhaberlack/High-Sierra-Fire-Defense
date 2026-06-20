export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "High Sierra Fire Defense",
    description:
      "An intelligent exterior wildfire defense system for mountain homes in Reno, Tahoe, Truckee, and Northern Nevada.",
    url: "https://highsierrafiredefense.com",
    areaServed: [
      { "@type": "City", name: "Reno", containedInPlace: { "@type": "State", name: "Nevada" } },
      { "@type": "City", name: "Truckee", containedInPlace: { "@type": "State", name: "California" } },
      { "@type": "Place", name: "Lake Tahoe" },
      { "@type": "Place", name: "Northern Nevada" },
    ],
    knowsAbout: [
      "Wildfire defense",
      "Exterior wildfire sprinkler systems",
      "Home wildfire protection",
      "Wildfire mitigation",
      "Defensible space water systems",
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "High Sierra Fire Defense | Wildfire Defense for Reno, Tahoe & Northern Nevada",
    description:
      "An intelligent exterior wildfire defense system for mountain homes in Reno, Tahoe, Truckee, and Northern Nevada. Join the early access list.",
    about: {
      "@type": "Thing",
      name: "Residential wildfire mitigation and exterior pre-wetting systems",
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is this an interior fire sprinkler system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. High Sierra Fire Defense is an exterior wildfire mitigation system designed for roofline, eave, and perimeter pre-wetting. It is not an interior fire suppression sprinkler system.",
        },
      },
      {
        "@type": "Question",
        name: "Does this system guarantee my home will survive a wildfire?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This system is designed to help reduce ember ignition risk and support defensible-space efforts. It does not guarantee structure survival and is not a replacement for evacuation planning, home hardening, or guidance from fire professionals.",
        },
      },
      {
        "@type": "Question",
        name: "What areas does High Sierra Fire Defense serve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The system is being developed for homeowners in Reno, Lake Tahoe, Truckee, and nearby Northern Nevada communities.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
