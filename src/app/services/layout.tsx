import React from "react";
import type { Metadata } from "next";
import { serviceCategories } from "@/data/services";

export const metadata: Metadata = {
  title: "Services | Color Rebel by Porscha",
  description: "Transparent pricing and premium salon services including cuts, vivid color, foils, balayage, double process, and waxing.",
  openGraph: {
    title: "Salon Services",
    description: "Explore services and transparent pricing at Color Rebel by Porscha.",
    images: [{ url: "https://colorrebelbyporscha.com/api/og?page=services", width: 1200, height: 630, alt: "Services" }],
    type: "website",
  },
};

function servicesJsonLd() {
  const baseUrl = "https://colorrebelbyporscha.com/services";
  let position = 0;
  const items = serviceCategories.flatMap((cat) =>
    cat.items.map((svc) => {
      position++;
      const anchor = cat.title.replace(/\s+/g, '-');
      return {
        "@type": "ListItem",
        position,
        item: {
          "@type": "Service",
          name: svc.name,
          description: svc.desc,
          url: `${baseUrl}#${anchor}`,
          serviceType: cat.title,
          provider: {
            "@type": "HairSalon",
            name: "Color Rebel by Porscha",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Leavenworth",
              addressRegion: "KS",
              addressCountry: "US"
            }
          },
          areaServed: {
            "@type": "City",
            name: "Leavenworth",
            containedInPlace: {
              "@type": "State",
              name: "Kansas"
            }
          },
          offers: {
            "@type": "Offer",
            price: svc.price.toString(),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "PriceSpecification",
              price: svc.price.toString(),
              priceCurrency: "USD"
            }
          },
        },
      };
    })
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items,
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd()) }}
      />
      {children}
    </>
  );
}
