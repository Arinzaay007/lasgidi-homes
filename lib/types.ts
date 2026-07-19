export type Role = "agent" | "seeker";

export type Profile = {
  id: string;
  role: Role;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  avatar_url: string | null;
  verified: boolean;
  created_at: string;
};

export type Listing = {
  id: string;
  agent_id: string;
  title: string;
  description: string | null;
  price: number;
  listing_type: "rent" | "sale";
  property_type: string;
  bedrooms: number | null;
  area: string;
  landmark: string | null;
  agency_fee: number;
  caution_fee: number;
  images: string[];
  status: "available" | "taken";
  created_at: string;
  profiles?: Profile; // joined agent profile
};

export const LAGOS_AREAS = [
  "Lekki",
  "Ikeja",
  "Yaba",
  "Surulere",
  "Ajah",
  "Victoria Island",
  "Ikoyi",
  "Gbagada",
  "Magodo",
  "Ogba",
  "Egbeda",
  "Ikorodu",
  "Festac",
  "Maryland",
  "Isolo",
];

export const PROPERTY_TYPES = [
  "Self-contain",
  "Mini flat",
  "2 Bedroom flat",
  "3 Bedroom flat",
  "4 Bedroom flat",
  "Duplex",
  "Terrace",
  "Bungalow",
  "Land",
  "Office space",
  "Shop",
];
