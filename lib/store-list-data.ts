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

export const storeItems: StoreItem[] = [
  {
    id: "downtown",
    name: "Downtown Store",
    address: "123 Market Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "downtown@gofarm.com",
    country: "USA",
    hours: "Monday - Friday: 9AM - 6PM",
    city: "New York",
    pinX: 32,
    pinY: 54,
    tint: "red",
    lat: 40.7128,
    lng: -74.0060,
  },
  {
    id: "go-farm-llc",
    name: "Go Farm LLC",
    address: "45 Commerce Ave, Chicago, IL 60601",
    phone: "+1 (555) 246-8899",
    email: "chicago@gofarm.com",
    country: "USA",
    hours: "Monday - Saturday: 8AM - 7PM",
    city: "Chicago",
    pinX: 22,
    pinY: 58,
    tint: "green",
    lat: 41.8781,
    lng: -87.6298,
  },
  {
    id: "loyalty",
    name: "Loyalty Store",
    address: "10 Union Square, Boston, MA 02108",
    phone: "+1 (555) 382-1104",
    email: "boston@gofarm.com",
    country: "USA",
    hours: "Monday - Friday: 9AM - 6PM",
    city: "Boston",
    pinX: 28,
    pinY: 46,
    tint: "green",
    lat: 42.3601,
    lng: -71.0589,
  },
  {
    id: "new-store",
    name: "New Store",
    address: "78 Harbor Road, San Diego, CA 92101",
    phone: "+1 (555) 908-2230",
    email: "sandiego@gofarm.com",
    country: "USA",
    hours: "Monday - Sunday: 8AM - 8PM",
    city: "San Diego",
    pinX: 8,
    pinY: 68,
    tint: "red",
    lat: 32.7157,
    lng: -117.1611,
  },
  {
    id: "super-deal",
    name: "Super Deal",
    address: "22 Queen Street, London W1A 1AA",
    phone: "+44 20 7946 0123",
    email: "london@gofarm.com",
    country: "UK",
    hours: "Monday - Saturday: 9AM - 7PM",
    city: "London",
    pinX: 56,
    pinY: 30,
    tint: "green",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    id: "back-store",
    name: "The Back Store",
    address: "12 Rue de Rivoli, Paris 75001",
    phone: "+33 1 44 55 66 77",
    email: "paris@gofarm.com",
    country: "France",
    hours: "Monday - Friday: 10AM - 7PM",
    city: "Paris",
    pinX: 54,
    pinY: 34,
    tint: "red",
    lat: 48.8566,
    lng: 2.3522,
  },
];

export const quickFacts = [
  { label: "Stores Found", value: "6" },
  { label: "Countries", value: "3" },
  { label: "Avg. Hours", value: "9AM - 7PM" },
];
