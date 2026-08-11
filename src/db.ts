import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Product, Order, Cart } from './types';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc,
  deleteDoc, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';

let firestore: any = null;

try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const firebaseConfig = {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    };
    
    const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestore = config.firestoreDatabaseId 
      ? getFirestore(firebaseApp, config.firestoreDatabaseId)
      : getFirestore(firebaseApp);
    console.log("Firebase Firestore initialized successfully with DB ID:", config.firestoreDatabaseId);
    
    // Quick validation check as per SKILL.md
    getDocFromServer(doc(firestore, 'test', 'connection')).catch(() => {});
  } else {
    console.warn("firebase-applet-config.json not found, falling back to local database.");
  }
} catch (e) {
  console.error("Failed to initialize Firebase:", e);
}

const ROOT_DB_FILE = path.join(process.cwd(), 'zariha_db.json');
const NODE_MODULES_DB_FILE = path.join(process.cwd(), 'node_modules', 'zariha_db.json');

const DB_FILE = fs.existsSync(ROOT_DB_FILE) 
  ? ROOT_DB_FILE 
  : NODE_MODULES_DB_FILE;

// All products sourced from mushtaqsons.pk/collections/new-arrival-1
const SEED_PRODUCTS: Product[] = [
  {
    id: "ms-001",
    name: "Embroidered 3 Piece Indigo Suit",
    price: 6699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09743.jpg?v=1779358189",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09759.jpg?v=1779357975",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09746.jpg?v=1779357935",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09763.jpg?v=1779357461"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Indigo Blue"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-002",
    name: "Embroidered 3 Piece Mustard Suite-Farshi",
    price: 6699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09075.jpg?v=1779356941",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09094.jpg?v=1779356963",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09097.jpg?v=1779356649",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09082.jpg?v=1779356649"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Farshi Shalwar Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Mustard Yellow"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Farshi Shalwar"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-003",
    name: "Embroidered 3-Piece Lilac Suit",
    price: 6699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09207.jpg?v=1779350029",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09223_9b3d9f07-0edb-4f1e-af21-c6c177e4ae29.jpg?v=1779350062",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09202.jpg?v=1779349706",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09210.jpg?v=1779349706"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Lilac Purple"],
    viewers: 23,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-004",
    name: "Ivory Blossom Embroidered Suit-3 Piece",
    price: 6699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09046.jpg?v=1779348577",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09061.jpg?v=1779348596",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09052.jpg?v=1779348356",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09047.jpg?v=1779348356"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Ivory Cream"],
    viewers: 9,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-005",
    name: "Blue Blossom 3 Piece Suit-Embroidered",
    price: 6599,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09818_300928bf-0c55-4c2f-9405-36c7c980160a.jpg?v=1779347903",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09838.jpg?v=1779347922",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09828.jpg?v=1779347854",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09822.jpg?v=1779347855"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Blue"],
    viewers: 12,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-006",
    name: "Aqua Floral Printed 3 Piece Suit-Embroidered",
    price: 6699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09230.jpg?v=1779347024",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09246.jpg?v=1779347045",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09228.jpg?v=1779346945",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09234.jpg?v=1779346945"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Aqua Green"],
    viewers: 12,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-007",
    name: "Embroidered 3 Piece Ochre Palette Suit",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8301.jpg?v=1778064867",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8335.jpg?v=1778064889",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8328.jpg?v=1778064230",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8326.jpg?v=1778064230"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Ochre Yellow"],
    viewers: 17,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-008",
    name: "3 Piece Vibrant Sky Blue Suit-Embroidered",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8535.jpg?v=1778063891",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8561.jpg?v=1778063913",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8565.jpg?v=1778063820",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8537.jpg?v=1778063821"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Trouser Fabric : Summer Cotton with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Blue"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-009",
    name: "Embroidered 3 Piece Suit-Farshi",
    price: 6849,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8570.jpg?v=1778063540",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8603.jpg?v=1778063557",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8578.jpg?v=1778063199",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8584.jpg?v=1778063199"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Farshi Shalwar : Fabric : Summer Cotton with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Farshi Shalwar :"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-010",
    name: "3 Piece Embroidered Black Floral Suit",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8424.jpg?v=1778062695",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8446.jpg?v=1778062714",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8458.jpg?v=1778062407",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8430.jpg?v=1778062407"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Trouser Fabric : Summer Cotton with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Black"],
    viewers: 16,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-011",
    name: "3 Piece Embroidered Mint Green Suit-Farshi",
    price: 6749,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8219.jpg?v=1778061646",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8236.jpg?v=1778061554",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8209.jpg?v=1778061476",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8242.jpg?v=1778061476"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Farshi Shalwar Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Mint Green"],
    viewers: 14,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Farshi Shalwar"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-012",
    name: "3 Piece Embroidered Mustard Cotton Suit",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09961.jpg?v=1778061197",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09976.jpg?v=1778061229",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09979.jpg?v=1778061052",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09959.jpg?v=1778061052"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Crinkle Chiffon Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Mustard Yellow"],
    viewers: 24,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Crinkle Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-013",
    name: "3 Piece Embroidered Summer Cotton Suit",
    price: 6799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00099.jpg?v=1778060433",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00111.jpg?v=1778060455",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00115.jpg?v=1778060342",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00096.jpg?v=1778060342"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Crinkle Chiffon Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 5,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Crinkle Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-014",
    name: "3 Piece Embroidered Peach Summer Cotton Suit",
    price: 6749,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8482.jpg?v=1778059715",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8504.jpg?v=1778059795",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8507.jpg?v=1778059644",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8470.jpg?v=1778059644"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Peach"],
    viewers: 17,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-015",
    name: "Embroidered 3 Piece Ivory Cream Suite With Floral Print",
    price: 6899,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8164.jpg?v=1778058763",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8185.jpg?v=1778058783",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8159.jpg?v=1778058719",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8166.jpg?v=1778058719"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton with Digital Print Dupatta : Lawn Dupatta Trouser Fabric : Cotton Lawn with Digital Print Model is wearing small size",
    stock: 10,
    colors: ["Ivory Cream"],
    viewers: 17,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton with Digital Print",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-016",
    name: "3 Piece Summer Cotton Suite-Embroidered",
    price: 6799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09707.jpg?v=1777387697",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09726.jpg?v=1777387715",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09732.jpg?v=1777387653",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09714.jpg?v=1777387654"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-017",
    name: "3 Piece Mustard suite-Embroidered",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09986.jpg?v=1777389184",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09997.jpg?v=1777389208",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09999.jpg?v=1777389145",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09981.jpg?v=1777389144"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Mustard Yellow"],
    viewers: 13,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-018",
    name: "3 Piece Embroidered Chestnut Brown Suite",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09912.jpg?v=1777388495",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09924.jpg?v=1777388516",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09926.jpg?v=1777388228",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09909.jpg?v=1777388228"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Brown"],
    viewers: 9,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-019",
    name: "3 Piece Summer Cotton Suite-Embroidered",
    price: 6799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09881_c04c42f9-a952-4a05-8aa5-8c29283351a4.jpg?v=1777388837",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09886_86e3ad7f-2c96-4407-947c-88bf0cedb45f.jpg?v=1777388860",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09888_d0cf5881-42b4-48c2-99c7-a25ad01c740e.jpg?v=1777388791",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09894_2b987464-925b-418d-bd45-00b72c47bf4f.jpg?v=1777388791"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 17,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-020",
    name: "Embroidered  3 Piece Ivory Cream suite",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8367.jpg?v=1777387294",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8398.jpg?v=1777387318",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8415.jpg?v=1777387240",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8382.jpg?v=1777387241"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton Dupatta : Lawn Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Ivory Cream"],
    viewers: 9,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-021",
    name: "3 Piece Orchid Pink suite-Embroidered",
    price: 6899,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09783.jpg?v=1777386830",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09798.jpg?v=1777386852",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09804.jpg?v=1777386779",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09782.jpg?v=1777386778"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Pink"],
    viewers: 6,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-022",
    name: "3 Piece Slate Teal suite-Embroidered",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8262.jpg?v=1777376003",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8277.jpg?v=1777376043",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8254.jpg?v=1777375903",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP8292.jpg?v=1777375904"
    ],
    description: "Shirt : Complete Front Embroidered Fabric : Summer Cotton Dupatta : Lawn Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Teal"],
    viewers: 16,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-023",
    name: "Embroidered 3 Piece Suite-Farshi Shalwar",
    price: 6799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04143.jpg?v=1775827868",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04161.jpg?v=1775827868",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04164.jpg?v=1775827868",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04137.jpg?v=1775827868"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Farshi Shalwar Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 5,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Farshi Shalwar"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-024",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04111.jpg?v=1775827403",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04130.jpg?v=1775827403",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04134.jpg?v=1775827403",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04116.jpg?v=1775827403"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-025",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6899,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04078.jpg?v=1775826427",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04105.jpg?v=1775826427",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04106.jpg?v=1775826427",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04094.jpg?v=1775826427"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 6,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-026",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03991.jpg?v=1775825955",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04004.jpg?v=1775825955",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04010.jpg?v=1775825955",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04001.jpg?v=1775825955"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 11,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-027",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 7199,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03882.jpg?v=1775825631",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03899.jpg?v=1775825651",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03904.jpg?v=1775825603",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03884.jpg?v=1775825603"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 5,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-028",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03819.jpg?v=1775825304",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03823.jpg?v=1775825304",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03829.jpg?v=1775825304",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03806.jpg?v=1775825304"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 20,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-029",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04205.jpg?v=1775476069",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04228.jpg?v=1775476069",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04231.jpg?v=1775476069",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04210.jpg?v=1775476069"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 9,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-030",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04050.jpg?v=1775475512",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04068.jpg?v=1775475512",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04072.jpg?v=1775475512",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04057.jpg?v=1775475512"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 5,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-031",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03775.jpg?v=1775475264",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03757.jpg?v=1775475264",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03766.jpg?v=1775475264",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03741.jpg?v=1775475264"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 7,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-032",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03212.jpg?v=1762499301",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03223.jpg?v=1762499342",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03231.jpg?v=1762499342",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03237.jpg?v=1762499342"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 17,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-033",
    name: "Embroidered 3 Piece Suite-Chiffon Dupatta",
    price: 6899,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04022.jpg?v=1773563908",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04042.jpg?v=1773563908",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04044.jpg?v=1773563908",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04019.jpg?v=1773563908"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Chiffon Dupatta Trouser Fabric : Cotton Lawn Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 8,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Chiffon",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-034",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2109.jpg?v=1773566783",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2123.jpg?v=1773566783",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2141.jpg?v=1773566783",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2117.jpg?v=1773566783"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-035",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5649,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4868.jpg?v=1760686994",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4882.jpg?v=1760687060",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4891.jpg?v=1760687060",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4894.jpg?v=1760687060"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 22,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-036",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03057.jpg?v=1762340892",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03066.jpg?v=1762340892",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03072.jpg?v=1762340892",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03076.jpg?v=1762340892"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 12,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-037",
    name: "Embroidered Summer Cotton Suit-3 Piece Stitched",
    price: 7299,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP08093.jpg?v=1772908345",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP08117.jpg?v=1772908345",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP08085.jpg?v=1772908345",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP08090.jpg?v=1772908345"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 13,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-038",
    name: "3 Piece Embroidered Summer Cotton Suit-Stitched",
    price: 6849,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07829.jpg?v=1772907562",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07839.jpg?v=1772907563",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07842.jpg?v=1772907563",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07848.jpg?v=1772907563"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 7,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-039",
    name: "3 Piece Embroidered Summer Cotton Suit-Stitched",
    price: 6699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07796.jpg?v=1772907299",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07821.jpg?v=1772907523",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07825.jpg?v=1772907523",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07802.jpg?v=1772907523"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 23,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-040",
    name: "3 Piece Embroidered Summer Cotton Suit-Stitched",
    price: 6899,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07770.jpg?v=1772907236",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07789.jpg?v=1772907264",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07791.jpg?v=1772907264",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07772.jpg?v=1772907264"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 20,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-041",
    name: "3 Piece Embroidered Summer Cotton Suit-Stitched",
    price: 6749,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07727.jpg?v=1772906830",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07753.jpg?v=1772906830",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07754.jpg?v=1772906830",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07722.jpg?v=1772906830"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 21,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-042",
    name: "3 Piece Embroidered Summer Cotton Suit-Stitched",
    price: 6799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07691.jpg?v=1772906538",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07707.jpg?v=1772906570",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07714.jpg?v=1772906570",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP07694.jpg?v=1772906570"
    ],
    description: "Shirt Complete Front EmbroideredFabric : Summer Cotton Dupatta Printed Diomond Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta Printed Diomond",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-043",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00017.jpg?v=1761549359",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00018.jpg?v=1761549392",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00041.jpg?v=1761549420",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC00044.jpg?v=1761549420"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Pure Lawn Dupatta Trouser : Same Fabric Printed Trouser Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 7,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Pure Lawn",
          "Dupatta",
          "Trouser : Same"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-044",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5849,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2049.jpg?v=1760078149",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2062.jpg?v=1760078149",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2070.jpg?v=1760078149",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC2073.jpg?v=1760078149"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Pure Lawn Dupatta Trouser : Same Fabric Printed Trouser Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 9,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Pure Lawn",
          "Dupatta",
          "Trouser : Same"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-045",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5649,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4904.jpg?v=1760687225",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4910.jpg?v=1760687225",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4922.jpg?v=1760687225",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC4926.jpg?v=1760687225"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Pure Lawn Dupatta Trouser : Same Fabric Printed Trouser Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 24,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Pure Lawn",
          "Dupatta",
          "Trouser : Same"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-046",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09904_7c01a0a0-29b1-4cc0-a8c2-75aff8a1e753.jpg?v=1761550576",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09915_d5b32328-5cc3-499b-8a34-6a77d020ccff.jpg?v=1761550576",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09918_3b405fb1-faec-4907-8bd4-ca910b889d08.jpg?v=1761550576",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09933_83a2a195-55a9-47cb-9284-dd2b07e90bbd.jpg?v=1761550576"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Pure Lawn Dupatta Trouser : Same Fabric Printed Trouser Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 13,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Pure Lawn",
          "Dupatta",
          "Trouser : Same"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-047",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5749,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03152.jpg?v=1772259830",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03157.jpg?v=1772259830",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03162.jpg?v=1772259830",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03166.jpg?v=1772259830"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Pure Lawn Dupatta Trouser : Same Fabric Printed Trouser Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 7,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Pure Lawn",
          "Dupatta",
          "Trouser : Same"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-048",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC02836.jpg?v=1762326590",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC02849.jpg?v=1762326642",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC02857.jpg?v=1762326642",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC02862.jpg?v=1762326642"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Pure Lawn Dupatta Trouser : Same Fabric Printed Trouser Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 5,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Pure Lawn",
          "Dupatta",
          "Trouser : Same"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-049",
    name: "3 Piece Cotton Lawn Suit Stitched-Embroidered",
    price: 5699,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03117.jpg?v=1762498526",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03131.jpg?v=1762498581",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03140.jpg?v=1762498581",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC03148.jpg?v=1762498581"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Cotton Lawn Dupatta : Pure Lawn Dupatta Trouser : Same Fabric Printed Trouser Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 11,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Cotton Lawn",
          "Dupatta : Pure Lawn",
          "Dupatta",
          "Trouser : Same"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-050",
    name: "3 Piece Summer Cotton Suit Stitched-Embroidered",
    price: 5499,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09338.jpg?v=1759472332",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09349.jpg?v=1759472363",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09356.jpg?v=1759472288",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09358.jpg?v=1759472288"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatta Pure Lawn Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 20,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton",
          "Dupatta Pure Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-051",
    name: "Embroidered 3 Piece Suite-Summer Cotton",
    price: 5999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09949.jpg?v=1769839879",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09948.jpg?v=1769839879",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09966.jpg?v=1769839879",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09938.jpg?v=1769839879"
    ],
    description: "Shirt : Complete Front EmbroideredFabric : Summer Cotton Dupatta : Gold Tilla Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 17,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Summer Cotton",
          "Dupatta : Gold Tilla",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-052",
    name: "Embroidered 3 Piece Suite-Summer Cotton",
    price: 6099,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09872.jpg?v=1769839592",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09882.jpg?v=1769839592",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09885.jpg?v=1769839592",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09880.jpg?v=1769839592"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Summer Cotton Dupatta : Gold Tilla Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 11,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Summer Cotton",
          "Dupatta : Gold Tilla",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-053",
    name: "Embroidered 3 Piece Suite-Summer Cotton",
    price: 6199,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09782.jpg?v=1769838945",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09795.jpg?v=1769839049",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09792.jpg?v=1769839049",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09783.jpg?v=1769839049"
    ],
    description: "Shirt : Front Embroidered With Print Fabric : Summer Cotton Dupatta : Gold Tilla Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 9,
    isNewArrival: true,
    features: [
          "Shirt : Front Embroidered With Print",
          "Fabric : Summer Cotton",
          "Dupatta : Gold Tilla",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-054",
    name: "3 Piece Embroidered Suite-Plain Soft Cotton",
    price: 5999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09590.jpg?v=1767975628",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09614.jpg?v=1767975698",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09622.jpg?v=1767975563",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC09599.jpg?v=1767975563"
    ],
    description: "Shirt : Complete Front EmbroideredFabric : Plain Soft Cotton Dupatta : Diamond Minar Dupatta Trouser Fabric : Plain Soft Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 11,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Plain Soft Cotton",
          "Dupatta : Diamond Minar",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-055",
    name: "3 Piece Summer Cotton Suit-Embroidered",
    price: 5599,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04768.jpg?v=1767968902",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04783.jpg?v=1767968902",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04785.jpg?v=1767968902",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04766.jpg?v=1767968902"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatt Printed Lawn Dupatta Trouser Printed Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 9,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton Dupatt Printed Lawn",
          "Dupatta",
          "Trouser Printed",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-056",
    name: "3 Piece Summer Cotton Suit-Embroidered",
    price: 5599,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04716.jpg?v=1767968627",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04734.jpg?v=1767968673",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04725.jpg?v=1767968673",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04717.jpg?v=1767968673"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatt Printed Lawn Dupatta Trouser Printed Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 5,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton Dupatt Printed Lawn",
          "Dupatta",
          "Trouser Printed",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-057",
    name: "3 Piece Summer Cotton Suit-Embroidered",
    price: 5649,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04572.jpg?v=1767968254",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04591.jpg?v=1767968318",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04592.jpg?v=1767968318",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04576.jpg?v=1767968318"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatt Printed Lawn Dupatta Trouser Printed Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 8,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton Dupatt Printed Lawn",
          "Dupatta",
          "Trouser Printed",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: true,
    onSale: false
  },
  {
    id: "ms-058",
    name: "3 Piece Summer Cotton Suit-Embroidered",
    price: 5649,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04547.jpg?v=1767968140",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04564.jpg?v=1767968140",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04546.jpg?v=1767968140",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04553.jpg?v=1767968140"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatt Printed Lawn Dupatta Trouser Printed Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 20,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton Dupatt Printed Lawn",
          "Dupatta",
          "Trouser Printed",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-059",
    name: "3 Piece Summer Cotton Suit-Embroidered",
    price: 5749,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04408.jpg?v=1767967828",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04424.jpg?v=1767967828",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04426.jpg?v=1767967828",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04401.jpg?v=1767967828"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatt Printed Lawn Dupatta Trouser Printed Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 17,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton Dupatt Printed Lawn",
          "Dupatta",
          "Trouser Printed",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-060",
    name: "3 Piece Summer Cotton Suit-Embroidered",
    price: 5799,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04373.jpg?v=1767967493",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04396.jpg?v=1767967556",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04398.jpg?v=1767967556",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC04382.jpg?v=1767967556"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatt Printed Lawn Dupatta Trouser Printed Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 15,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton Dupatt Printed Lawn",
          "Dupatta",
          "Trouser Printed",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-061",
    name: "3 Piece Embroidered Suite-Stitched",
    price: 7149,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09523copy.jpg?v=1767703324",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09569.jpg?v=1767703324",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09546.jpg?v=1767703324",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09517.jpg?v=1767703324"
    ],
    description: "Shirt : Complete Front EmbroideredFabric : Plain Soft Cotton Dupatta : Diamond Minar Dupatta Trouser Fabric : Plain Soft Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 20,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Plain Soft Cotton",
          "Dupatta : Diamond Minar",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-062",
    name: "3 Piece Embroidered Suite-Stitched",
    price: 6999,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09328copy.jpg?v=1767702023",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09354.jpg?v=1767702235",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09350.jpg?v=1767702428",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/RHP09325.jpg?v=1767702428"
    ],
    description: "Shirt : Complete Front EmbroideredFabric : Plain Soft Cotton Dupatta : Diamond Minar Dupatta Trouser : Fabric : Plain Soft Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 24,
    isNewArrival: true,
    features: [
          "Shirt : Complete Front Embroidered",
          "Fabric : Plain Soft Cotton",
          "Dupatta : Diamond Minar",
          "Dupatta",
          "Trouser :"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  },
  {
    id: "ms-063",
    name: "Stitched 3 Piece Summer Cotton Suit-Embroidered",
    price: 5649,
    fabric: "Lawn",
    type: "Embroidered",
    collection: "New Arrivals 26",
    images: [
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC5027.jpg?v=1760850299",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC5035.jpg?v=1760850373",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC5046.jpg?v=1760850373",
          "https://cdn.shopify.com/s/files/1/0723/2071/2952/files/DSC5053.jpg?v=1760850373"
    ],
    description: "Shirt Front Embroidered With Print Fabric : Summer Cotton Dupatta Pure Lawn Dupatta Trouser Fabric : Summer Cotton Model is wearing small size",
    stock: 10,
    colors: ["Multi"],
    viewers: 22,
    isNewArrival: true,
    features: [
          "Shirt Front Embroidered With Print",
          "Fabric : Summer Cotton",
          "Dupatta Pure Lawn",
          "Dupatta",
          "Trouser"
    ],
    category: "Unstitched",
    pieces: "3 Piece",
    season: "Summer",
    sizes: ["S","M","L","XL"],
    isBestSeller: false,
    onSale: false
  }
];

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
}

interface DBState {
  products: Product[];
  orders: Order[];
  carts: { [userId: string]: Cart };
  admins: AdminUser[];
  settings?: {
    announcementText?: string;
    homeMarqueeText?: string;
    shippingFee?: number;
    cardShippingFee?: number;
    codShippingFee?: number;
    freeShippingThreshold?: number;
  };
}

class Database {
  private state: DBState = {
    products: [],
    orders: [],
    carts: {},
    admins: []
  };

  constructor() {
    this.load();
    if (firestore) {
      this.initFirebaseSync();
    }
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        this.state = JSON.parse(data);
        // Ensure all seeded products exist (merge / add missing ones)
        const existingIds = new Set(this.state.products.map(p => p.id));
        // Remove any old dummy products that are no longer in SEED_PRODUCTS
        const seedIds = new Set(SEED_PRODUCTS.map(s => s.id));
        this.state.products = this.state.products.filter(p => seedIds.has(p.id) || !p.id.startsWith('zar-'));
        SEED_PRODUCTS.forEach(seed => {
          const idx = this.state.products.findIndex(p => p.id === seed.id);
          if (idx !== -1) {
            // merge new seeded properties into existing
            this.state.products[idx] = {
              ...this.state.products[idx],
              ...seed,
              // keep stateful fields
              stock: this.state.products[idx].stock !== undefined ? this.state.products[idx].stock : seed.stock,
              viewers: this.state.products[idx].viewers !== undefined ? this.state.products[idx].viewers : seed.viewers
            };
          } else {
            this.state.products.push(seed);
          }
        });
        
        // Ensure admins list is present and seeded
        if (!this.state.admins) {
          this.state.admins = [];
        }
        if (this.state.admins.length === 0) {
          this.state.admins.push({
            id: 'admin-001',
            email: 'admin@zariha.com',
            passwordHash: bcrypt.hashSync('admin123', 10)
          });
        }
        // Ensure settings are present
        if (!this.state.settings) {
          this.state.settings = {
            announcementText: "✦ Complimentary Nationwide Shipping ✦ Custom Boutique Packing ✦",
            homeMarqueeText: "✦ Zariha Couture ✦ Unstitched Luxury ✦ Handloom Heritage ✦ Festive Archive ✦"
          };
        }
        this.save();
      } else {
        this.state = {
          products: SEED_PRODUCTS,
          orders: [],
          carts: {},
          admins: [
            {
              id: 'admin-001',
              email: 'admin@zariha.com',
              passwordHash: bcrypt.hashSync('admin123', 10)
            }
          ],
          settings: {
            announcementText: "✦ Complimentary Nationwide Shipping ✦ Custom Boutique Packing ✦",
            homeMarqueeText: "✦ Zariha Couture ✦ Unstitched Luxury ✦ Handloom Heritage ✦ Festive Archive ✦"
          }
        };
        this.save();
      }
    } catch (e) {
      console.error('Error loading DB, resetting to defaults', e);
      this.state = {
        products: SEED_PRODUCTS,
        orders: [],
        carts: {},
        admins: [
          {
            id: 'admin-001',
            email: 'admin@zariha.com',
            passwordHash: bcrypt.hashSync('admin123', 10)
          }
        ]
      };
    }
  }

  private async initFirebaseSync() {
    if (!firestore) return;
    try {
      console.log("Setting up Firebase Firestore synchronization...");

      // 1. Sync products
      const productsRef = collection(firestore, 'products');
      const productsSnapshot = await getDocs(productsRef);
      const existingDocIds = new Set(productsSnapshot.docs.map(doc => doc.id));
      for (const p of SEED_PRODUCTS) {
        if (!existingDocIds.has(p.id)) {
          console.log(`Seeding missing product ${p.id} to Firestore...`);
          await setDoc(doc(firestore, 'products', p.id), p);
        }
      }

      // 2. Sync settings
      const settingsDocRef = doc(firestore, 'settings', 'global');
      const settingsSnapshot = await getDoc(settingsDocRef);
      if (!settingsSnapshot.exists()) {
        console.log("Firestore settings global doc is missing. Seeding defaults...");
        const defaultSettings = this.state.settings || {
          announcementText: "✦ Complimentary Shipping in UAE on orders above AED 500 ✦ Custom Boutique Packing ✦",
          homeMarqueeText: "✦ Zariha Couture ✦ Unstitched Luxury ✦ Handloom Heritage ✦ Festive Archive ✦",
          shippingFee: 15,
          cardShippingFee: 15,
          codShippingFee: 25,
          freeShippingThreshold: 500
        };
        await setDoc(settingsDocRef, defaultSettings);
      }

      // 3. Sync admins
      const defaultAdminDocRef = doc(firestore, 'admins', 'admin-001');
      const defaultAdminSnap = await getDoc(defaultAdminDocRef);
      if (!defaultAdminSnap.exists() || defaultAdminSnap.data()?.email === 'admin@zariha.com') {
        console.log("Firestore default admin updated to ROTBA credentials...");
        const defaultAdmin = {
          id: 'admin-001',
          email: 'admin@rotba.com',
          passwordHash: bcrypt.hashSync('rutba123', 10)
        };
        await setDoc(defaultAdminDocRef, defaultAdmin);
      }

      // Setup real-time listeners to keep local state synchronized
      onSnapshot(collection(firestore, 'products'), (snapshot) => {
        const products: Product[] = [];
        snapshot.forEach((docSnap) => {
          products.push(docSnap.data() as Product);
        });
        if (products.length > 0) {
          this.state.products = products;
        }
      });

      onSnapshot(collection(firestore, 'orders'), (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(docSnap.data() as Order);
        });
        this.state.orders = orders;
      });

      onSnapshot(collection(firestore, 'carts'), (snapshot) => {
        const carts: { [userId: string]: Cart } = {};
        snapshot.forEach((docSnap) => {
          const cart = docSnap.data() as Cart;
          carts[cart.userId] = cart;
        });
        this.state.carts = carts;
      });

      onSnapshot(doc(firestore, 'settings', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          this.state.settings = docSnap.data() as any;
        }
      });

      onSnapshot(collection(firestore, 'admins'), (snapshot) => {
        const admins: AdminUser[] = [];
        snapshot.forEach((docSnap) => {
          admins.push(docSnap.data() as AdminUser);
        });
        if (admins.length > 0) {
          this.state.admins = admins;
        }
      });

      console.log("Firestore real-time synchronization active!");
    } catch (err) {
      console.error("Error during Firebase setup sync:", err);
    }
  }

  private cleanForFirestore(obj: any): any {
    if (obj === null || obj === undefined) {
      return null;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanForFirestore(item));
    }
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const val = obj[key];
          if (val !== undefined) {
            cleaned[key] = this.cleanForFirestore(val);
          }
        }
      }
      return cleaned;
    }
    return obj;
  }

  private async writeFirestoreDoc(colName: string, docId: string, data: any) {
    if (!firestore) return;
    try {
      const cleanedData = this.cleanForFirestore(data);
      await setDoc(doc(firestore, colName, docId), cleanedData);
    } catch (e) {
      console.error(`Error writing to Firestore ${colName}/${docId}:`, e);
    }
  }

  private async deleteFirestoreDoc(colName: string, docId: string) {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, colName, docId));
    } catch (e) {
      console.error(`Error deleting from Firestore ${colName}/${docId}:`, e);
    }
  }

  public save() {
    try {
      const data = JSON.stringify(this.state, null, 2);
      fs.writeFileSync(ROOT_DB_FILE, data, 'utf-8');
      if (fs.existsSync(path.dirname(NODE_MODULES_DB_FILE))) {
        try { fs.writeFileSync(NODE_MODULES_DB_FILE, data, 'utf-8'); } catch (_) {}
      }
    } catch (e) {
      console.error('Error saving DB', e);
    }
  }

  public getProducts(): Product[] {
    return this.state.products;
  }

  public getProduct(id: string): Product | undefined {
    return this.state.products.find(p => p.id === id);
  }

  public updateProductStock(id: string, newStock: number): boolean {
    const product = this.getProduct(id);
    if (product) {
      product.stock = Math.max(0, newStock);
      this.save();
      this.writeFirestoreDoc('products', id, product);
      return true;
    }
    return false;
  }

  public updateProductViewers(id: string, viewers: number): boolean {
    const product = this.getProduct(id);
    if (product) {
      product.viewers = Math.max(1, viewers);
      return true;
    }
    return false;
  }

  public getCart(userId: string): Cart {
    if (!this.state.carts[userId]) {
      this.state.carts[userId] = { userId, items: [] };
      this.save();
      this.writeFirestoreDoc('carts', userId, this.state.carts[userId]);
    }
    return this.state.carts[userId];
  }

  public updateCart(userId: string, items: { productId: string; quantity: number }[]): Cart {
    const validItems = items.filter(item => {
      const prod = this.getProduct(item.productId);
      return prod && item.quantity > 0;
    });

    this.state.carts[userId] = { userId, items: validItems };
    this.save();
    this.writeFirestoreDoc('carts', userId, this.state.carts[userId]);
    return this.state.carts[userId];
  }

  public clearCart(userId: string) {
    this.state.carts[userId] = { userId, items: [] };
    this.save();
    this.writeFirestoreDoc('carts', userId, this.state.carts[userId]);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingNumber'>): Order {
    const trackingNumber = `RR-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Deduct stock for each item in the order
    orderData.items.forEach(item => {
      const prod = this.getProduct(item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        this.writeFirestoreDoc('products', prod.id, prod);
      }
    });

    const newOrder: Order = {
      ...orderData,
      id,
      trackingNumber,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    this.state.orders.push(newOrder);
    this.save();
    this.writeFirestoreDoc('orders', id, newOrder);
    return newOrder;
  }

  public getOrders(): Order[] {
    return this.state.orders;
  }

  public clearAllOrders() {
    this.state.orders = [];
    this.save();
  }

  public getOrder(id: string): Order | undefined {
    return this.state.orders.find(o => o.id === id || o.trackingNumber === id);
  }

  public getAdminByEmail(email: string): AdminUser | undefined {
    return this.state.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  public createProduct(p: Product): Product {
    // Generate simple ID if none provided
    if (!p.id) {
      p.id = `ms-${Math.floor(100 + Math.random() * 900)}`;
    }
    // Set default values for visual elements if missing
    if (typeof p.viewers === 'undefined') p.viewers = 5;
    if (typeof p.isNewArrival === 'undefined') p.isNewArrival = false;
    
    this.state.products.push(p);
    this.save();
    this.writeFirestoreDoc('products', p.id, p);
    return p;
  }

  public updateProduct(id: string, updated: Partial<Product>): Product | undefined {
    const product = this.getProduct(id);
    if (product) {
      Object.assign(product, updated);
      this.save();
      this.writeFirestoreDoc('products', id, product);
      return product;
    }
    return undefined;
  }

  public deleteProduct(id: string): boolean {
    const index = this.state.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.state.products.splice(index, 1);
      this.save();
      this.deleteFirestoreDoc('products', id);
      return true;
    }
    return false;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const order = this.getOrder(id);
    if (order) {
      order.status = status;
      this.save();
      this.writeFirestoreDoc('orders', order.id, order);
      return order;
    }
    return undefined;
  }

  public getSettings() {
    if (!this.state.settings) {
      this.state.settings = {
        announcementText: "✦ Complimentary Shipping in UAE on orders above AED 500 ✦ Custom Boutique Packing ✦",
        homeMarqueeText: "✦ Zariha Couture ✦ Unstitched Luxury ✦ Handloom Heritage ✦ Festive Archive ✦",
        shippingFee: 15,
        cardShippingFee: 15,
        codShippingFee: 25,
        freeShippingThreshold: 500
      };
      this.save();
    } else {
      if (this.state.settings.shippingFee === 250 || typeof this.state.settings.shippingFee === 'undefined') {
        this.state.settings.shippingFee = 15;
      }
      if (typeof this.state.settings.cardShippingFee === 'undefined') {
        this.state.settings.cardShippingFee = 15;
      }
      if (typeof this.state.settings.codShippingFee === 'undefined') {
        this.state.settings.codShippingFee = 25;
      }
      if (this.state.settings.freeShippingThreshold === 5000 || typeof this.state.settings.freeShippingThreshold === 'undefined') {
        this.state.settings.freeShippingThreshold = 500;
      }
      if (this.state.settings.announcementText && this.state.settings.announcementText.includes("Nationwide")) {
        this.state.settings.announcementText = "✦ Complimentary Shipping in UAE on orders above AED 500 ✦ Custom Boutique Packing ✦";
      }
    }
    return this.state.settings;
  }

  public updateSettings(updated: any) {
    const current = this.getSettings();
    Object.assign(current, updated);
    this.save();
    this.writeFirestoreDoc('settings', 'global', current);
    return current;
  }
}

export const db = new Database();
