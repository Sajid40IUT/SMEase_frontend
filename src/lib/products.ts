export interface Supplier {
  name: string;
  contact: string;
  email: string;
}

export interface Product {
  upc: string;
  name: string;
  stock: number;
  sold: number;
  minStock: number;
  supplier: Supplier;
}

export const products: Product[] = [
  { upc: "123456789012", name: "Gaming Laptop", stock: 5, sold: 120, minStock: 10, supplier: { name: "Tech Distributors Ltd.", contact: "+1-555-1234", email: "sales@techdist.com" } },
  { upc: "234567890123", name: "Mechanical Keyboard", stock: 2, sold: 80, minStock: 5, supplier: { name: "KeyPro Supplies", contact: "+1-555-2345", email: "info@keypro.com" } },
  { upc: "345678901234", name: "Wireless Mouse", stock: 25, sold: 200, minStock: 10, supplier: { name: "Mouse Masters", contact: "+1-555-3456", email: "support@mousemasters.com" } },
  { upc: "456789012345", name: "4K Monitor", stock: 0, sold: 60, minStock: 3, supplier: { name: "Display Depot", contact: "+1-555-4567", email: "contact@displaydepot.com" } },
  { upc: "567890123456", name: "External SSD", stock: 15, sold: 150, minStock: 8, supplier: { name: "Storage Solutions", contact: "+1-555-5678", email: "orders@storagesol.com" } },
  { upc: "678901234567", name: "Gaming Mousepad", stock: 0, sold: 40, minStock: 5, supplier: { name: "Pad Pros", contact: "+1-555-6789", email: "hello@padpros.com" } },
  { upc: "789012345678", name: "USB-C Hub", stock: 8, sold: 90, minStock: 10, supplier: { name: "Hub Central", contact: "+1-555-7890", email: "sales@hubcentral.com" } },
  { upc: "890123456789", name: "Bluetooth Speaker", stock: 3, sold: 110, minStock: 8, supplier: { name: "SoundWave Inc.", contact: "+1-555-8901", email: "contact@soundwave.com" } },
  { upc: "901234567890", name: "Webcam", stock: 0, sold: 70, minStock: 4, supplier: { name: "Visionary Supplies", contact: "+1-555-9012", email: "info@visionarysup.com" } },
  { upc: "012345678901", name: "Laptop Stand", stock: 12, sold: 55, minStock: 6, supplier: { name: "StandUp Co.", contact: "+1-555-0123", email: "support@standupco.com" } },
  { upc: "112345678902", name: "Portable Monitor", stock: 7, sold: 30, minStock: 5, supplier: { name: "Display Depot", contact: "+1-555-4567", email: "contact@displaydepot.com" } },
  { upc: "212345678903", name: "VR Headset", stock: 1, sold: 25, minStock: 2, supplier: { name: "VR World", contact: "+1-555-3210", email: "sales@vrworld.com" } },
  { upc: "312345678904", name: "Mechanical Switches", stock: 20, sold: 80, minStock: 10, supplier: { name: "KeyPro Supplies", contact: "+1-555-2345", email: "info@keypro.com" } },
  { upc: "412345678905", name: "Thermal Paste", stock: 0, sold: 60, minStock: 5, supplier: { name: "Cooler Supplies", contact: "+1-555-6543", email: "orders@coolersupplies.com" } },
  { upc: "512345678906", name: "Power Bank", stock: 18, sold: 140, minStock: 10, supplier: { name: "Storage Solutions", contact: "+1-555-5678", email: "orders@storagesol.com" } },
  { upc: "612345678907", name: "HDMI Cable", stock: 30, sold: 200, minStock: 15, supplier: { name: "Cable Connect", contact: "+1-555-7891", email: "sales@cableconnect.com" } },
  { upc: "712345678908", name: "Ethernet Cable", stock: 22, sold: 180, minStock: 12, supplier: { name: "Cable Connect", contact: "+1-555-7891", email: "sales@cableconnect.com" } },
  { upc: "812345678909", name: "SSD Enclosure", stock: 4, sold: 50, minStock: 6, supplier: { name: "Storage Solutions", contact: "+1-555-5678", email: "orders@storagesol.com" } },
  { upc: "912345678910", name: "WiFi Adapter", stock: 0, sold: 45, minStock: 5, supplier: { name: "NetGear Supplies", contact: "+1-555-4321", email: "info@netgear.com" } },
  { upc: "102345678911", name: "Desktop RAM", stock: 9, sold: 100, minStock: 8, supplier: { name: "Memory Masters", contact: "+1-555-8765", email: "sales@memorymasters.com" } },
  { upc: "202345678912", name: "CPU Cooler", stock: 6, sold: 75, minStock: 7, supplier: { name: "Cooler Supplies", contact: "+1-555-6543", email: "orders@coolersupplies.com" } },
  { upc: "302345678913", name: "Motherboard", stock: 2, sold: 35, minStock: 3, supplier: { name: "Tech Distributors Ltd.", contact: "+1-555-1234", email: "sales@techdist.com" } },
  { upc: "402345678914", name: "Graphics Card", stock: 0, sold: 20, minStock: 2, supplier: { name: "Tech Distributors Ltd.", contact: "+1-555-1234", email: "sales@techdist.com" } },
  { upc: "502345678915", name: "Gaming Chair", stock: 5, sold: 60, minStock: 4, supplier: { name: "Chair Masters", contact: "+1-555-2468", email: "info@chairmasters.com" } },
];

export function addProduct(product: Product) {
  products.push(product);
} 