import { initFirebase } from './config/firebase';
import { SEED_PRODUCTS } from './db';

async function seedProducts() {
  console.log("Starting explicit Firestore product seeding...");
  const firestore = initFirebase();
  if (!firestore) {
    console.error("Firebase not initialized. Cannot seed products.");
    process.exit(1);
  }

  try {
    const productsRef = firestore.collection('products');
    const productsSnapshot = await productsRef.get();
    const existingDocIds = new Set(productsSnapshot.docs.map(d => d.id));

    let addedCount = 0;
    for (const p of SEED_PRODUCTS) {
      if (!existingDocIds.has(p.id)) {
        console.log(`Seeding missing product ${p.id} to Firestore...`);
        await productsRef.doc(p.id).set(p);
        addedCount++;
      }
    }

    console.log(`Explicit seeding complete! ${addedCount} products added.`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding products:", err);
    process.exit(1);
  }
}

seedProducts();
