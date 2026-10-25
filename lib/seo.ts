import "server-only";
import type { Metadata } from "next";
import { getLocation } from "./content";
import { getSiteConfig } from "./site";
import type { Flat } from "./types";
import { typeLabel } from "./utils";

export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  const site = getSiteConfig();
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${site.name}`, description, url: path, siteName: site.name, type: "website", locale: "en_IN", ...(image ? { images: [image] } : {}) },
    twitter: { card: "summary_large_image", title, description },
  };
}

export function localBusinessLd() {
  const site = getSiteConfig();
  const loc = getLocation();
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${site.url}/#business`,
    name: site.name,
    url: site.url,
    telephone: `+${site.phone}`,
    email: site.email,
    image: `${site.url}/opengraph-image`,
    address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: "Kattankulathur", addressRegion: "Tamil Nadu", postalCode: "603203", addressCountry: "IN" },
    geo: { "@type": "GeoCoordinates", latitude: loc.estate.lat, longitude: loc.estate.lng },
    areaServed: ["Kattankulathur", "Potheri", "SRM Nagar", "Guduvanchery", "Maraimalai Nagar"],
    openingHours: "Mo-Sa 09:30-19:30",
    priceRange: "₹₹",
  };
}

export function listingLd(flat: Flat) {
  const site = getSiteConfig();
  const loc = getLocation();
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${typeLabel(flat.type)} for rent, ${flat.id}, Abode Valley`,
    url: `${site.url}/flats/${flat.id}`,
    datePosted: flat.listedAt,
    image: flat.images.map((i) => site.url + i),
    offers: {
      "@type": "Offer",
      price: flat.rent,
      priceCurrency: "INR",
      availability: flat.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      availabilityStarts: flat.availableFrom,
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      seller: { "@id": `${site.url}/#business` },
    },
    about: {
      "@type": "Apartment",
      name: `Flat ${flat.id}`,
      numberOfRooms: flat.type === "3BHK" ? 3 : 2.75,
      numberOfBedrooms: flat.type === "3BHK" ? 3 : 2,
      numberOfBathroomsTotal: flat.bathrooms,
      floorLevel: String(flat.floor),
      floorSize: { "@type": "QuantitativeValue", value: flat.sqft, unitCode: "FTK" },
      petsAllowed: flat.petsAllowed,
      address: { "@type": "PostalAddress", streetAddress: `Block ${flat.block}, Abode Valley`, addressLocality: "Kattankulathur", addressRegion: "Tamil Nadu", addressCountry: "IN" },
      geo: { "@type": "GeoCoordinates", latitude: loc.estate.lat, longitude: loc.estate.lng },
    },
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
