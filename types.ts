export enum Area {
  Kismatpur = "Kismatpur",
  Budvel = "Budvel",
  Attapur = "Attapur",
  Suncity = "Suncity",
  Bandlaguda = "Bandlaguda",
  GaganPahad = "Gagan Pahad",
  Shivrampalli = "Shivrampalli",
  Lakshmiguda = "Lakshmiguda",
  Satamrai = "Satamrai",
  Premavathipet = "Premavathipet",
  ArshMahalRoad = "Arsh Mahal Road",
  AirportRoad = "Airport Road",
  Kattedan = "Kattedan",
  AppalappaGuda = "Appalappa Guda"
}

export enum PropertyType {
  Villa = "Villa",
  Apartment = "Apartment",
  IndependentHouse = "Independent House",
  OpenPlot = "Open Plot"
}

export enum SizeUnit {
  SqFt = "Sq Ft",
  SqYd = "Sq Yd",
  Gaj = "Gaj"
}

export enum ContactType {
  Default = "default",
  Custom = "custom"
}

export interface PropertyData {
  title: string;
  area: Area;
  propertyType: PropertyType;
  size: {
    value: number;
    unit: SizeUnit;
  };
  price: number;
  facing: string;
  description: string;
  amenities: string[];
  location: {
    googleMapsLink: string;
  };
  media: {
    youtubeLink?: string;
    images: string[]; // Base64 encoded WebP strings
  };
  contact: {
    type: ContactType;
    name?: string;
    phone?: string;
    whatsapp?: string;
  };
}

export interface Property extends PropertyData {
  id: string;
  created_at: string;
}

export const AMENITIES_LIST = [
  "Gated Community",
  "24/7 Security",
  "Water Supply",
  "Power Backup",
  "Car Parking",
  "Lift",
  "Club House",
  "Swimming Pool",
  "Gym",
  "Park / Garden",
  "Vastu Compliant"
];