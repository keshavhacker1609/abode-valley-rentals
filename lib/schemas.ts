import { z } from "zod";

const phone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^(\+?91)?[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"));

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone,
  email: z.string().trim().email("That email doesn't look right").optional().or(z.literal("")),
  flatType: z.enum(["2.75BHK", "3BHK", "Co-living", "Not sure"], { errorMap: () => ({ message: "Pick a flat type" }) }),
  budget: z.coerce.number({ invalid_type_error: "Pick a budget" }).min(5000, "Pick a budget").max(200000),
  moveIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a move-in date"),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  flatId: z.string().optional(),
  // Honeypot: real people never see or fill this.
  company: z.string().max(0).optional().or(z.literal("")),
});
export type Enquiry = z.infer<typeof enquirySchema>;

export const visitSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a day"),
  slot: z.string().min(1, "Pick a time"),
  flatId: z.string().optional(),
  company: z.string().max(0).optional().or(z.literal("")),
});
export type Visit = z.infer<typeof visitSchema>;

export const ownerSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone,
  email: z.string().trim().email("That email doesn't look right").optional().or(z.literal("")),
  flatId: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]-[1-9]\d{2}$/, "Use the block-unit format, e.g. C-804"),
  type: z.enum(["2.75BHK", "3BHK"]),
  furnishing: z.enum(["Unfurnished", "Semi", "Fully"]),
  expectedRent: z.coerce.number({ invalid_type_error: "Enter an amount" }).min(5000, "Enter an amount").max(200000),
  availableFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  tenantPref: z.enum(["Family", "Bachelors", "Students", "Any"]),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you own or manage this flat" }) }),
  company: z.string().max(0).optional().or(z.literal("")),
});
export type OwnerListing = z.infer<typeof ownerSchema>;

export const adminPatchSchema = z.object({
  status: z.enum(["available", "reserved", "rented"]).optional(),
  rent: z.coerce.number().int().min(1000).max(500000).optional(),
  deposit: z.coerce.number().int().min(0).max(5000000).optional(),
  maintenance: z.coerce.number().int().min(0).max(100000).optional(),
  availableFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  furnishing: z.enum(["Unfurnished", "Semi", "Fully"]).optional(),
});

export const callbackSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  phone,
  context: z.string().max(200).optional(),
  company: z.string().max(0).optional().or(z.literal("")),
});
export type Callback = z.infer<typeof callbackSchema>;
