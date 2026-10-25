export type FlatType = "2.75BHK" | "3BHK";
export type Facing = "East" | "West" | "North" | "South";
export type Furnishing = "Unfurnished" | "Semi" | "Fully";
export type FlatStatus = "available" | "reserved" | "rented";
export type TenantPref = "Family" | "Bachelors" | "Students" | "Any";

export interface Flat {
  id: string;
  block: string;
  floor: number;
  unitNo: string;
  type: FlatType;
  sqft: number;
  bathrooms: number;
  balconies: number;
  facing: Facing;
  furnishing: Furnishing;
  rent: number;
  deposit: number;
  depositMonths: number;
  maintenance: number;
  availableFrom: string;
  status: FlatStatus;
  tenantPref: TenantPref;
  parking: string;
  petsAllowed: boolean;
  listedAt: string;
  floorPlan: string;
  images: string[];
  highlights: string[];
}

/** Fields an owner/admin may change at runtime without touching the seed file. */
export type FlatOverride = Partial<Pick<Flat, "status" | "rent" | "deposit" | "maintenance" | "availableFrom" | "furnishing">> & {
  updatedAt?: string;
};

export interface Block {
  id: string;
  name: string;
  floors: number;
  unitsPerFloor: number;
  completed: string;
  plan: { x: number; y: number };
  offset: { lat: number; lng: number };
  image: string;
}

export interface CoLivingRoom {
  sharing: "single" | "double" | "triple";
  price: number;
  available: number;
  sizeSqft: number;
}

export interface CoLivingResidence {
  id: string;
  name: string;
  operator: string;
  locality: string;
  gender: string;
  distanceKm: number;
  image: string;
  rooms: CoLivingRoom[];
  inclusions: {
    meals: string;
    wifi: string;
    housekeeping: string;
    laundry: string;
    ac: boolean;
    powerBackup: boolean;
    gym: boolean;
    security: string;
  };
}

export interface Place {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  minutes: number;
  mode: string;
  lat: number;
  lng: number;
}

export interface Broker {
  id: string;
  name: string;
  role: string;
  phone: string; // digits, with country code
  phoneDisplay: string;
  email: string;
  primary?: boolean;
}

export interface SiteConfig {
  name: string;
  url: string;
  phone: string; // digits, with country code
  phoneDisplay: string;
  email: string;
  address: string;
  hours: string;
  mapsKey: string;
  team: Broker[];
}
