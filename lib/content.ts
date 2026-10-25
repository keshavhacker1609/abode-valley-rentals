import amenities from "@/data/amenities.json";
import coliving from "@/data/coliving.json";
import content from "@/data/content.json";
import faqs from "@/data/faqs.json";
import location from "@/data/location.json";
import processSteps from "@/data/process.json";
import testimonials from "@/data/testimonials.json";
import type { CoLivingResidence, Place } from "./types";

export const getAmenities = () => amenities;
export const getCoLiving = () => coliving as CoLivingResidence[];
export const getContent = () => content;
export const getFaqs = (tag?: string) => (tag ? faqs.filter((f) => f.tags.includes(tag)) : faqs);
export const getLocation = () => location as typeof location & { places: Place[] };
export const getProcess = () => processSteps;
export const getTestimonials = () => testimonials;
