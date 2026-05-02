export type StoreItem = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  country: string;
  hours: string;
  city: string;
  pinX: number;
  pinY: number;
  tint: "green" | "red";
  lat?: number;
  lng?: number;
};
