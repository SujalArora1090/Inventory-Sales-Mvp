import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Product from "../models/Product.js";

const sampleProducts = [
  { name: "Amul Full Cream Milk (1L)", sku: "MILK-AMUL-001", category: "Dairy", price: 70, quantity: 200, reorderLevel: 20 },
  { name: "Ananda A2 Full Cream (1L)", sku: "MILK-ANND-001", category: "Dairy", price: 70, quantity: 150, reorderLevel: 20 },
  { name: "Potato (Loose) 1kg", sku: "VEG-POTATO-001", category: "Vegetables", price: 30, quantity: 500, reorderLevel: 50 },
  { name: "Onion (Loose) 1kg", sku: "VEG-ONION-001", category: "Vegetables", price: 40, quantity: 400, reorderLevel: 50 },
  { name: "Paneer 200g", sku: "DAIRY-PANEER-200", category: "Dairy", price: 80, quantity: 120, reorderLevel: 10 },
  { name: "Sugar 1kg", sku: "GROC-SUGAR-001", category: "Grocery", price: 45, quantity: 300, reorderLevel: 30 },
  { name: "Salt 1kg", sku: "GROC-SALT-001", category: "Grocery", price: 25, quantity: 300, reorderLevel: 30 },
  { name: "Bread (Loaf)", sku: "BAKE-BREAD-001", category: "Bakery", price: 35, quantity: 200, reorderLevel: 20 },
  { name: "Eggs (12 pcs)", sku: "EGG-12-001", category: "Dairy", price: 90, quantity: 180, reorderLevel: 20 },
  { name: "Olive Oil 500ml", sku: "GROC-OIL-500", category: "Grocery", price: 350, quantity: 50, reorderLevel: 10 }
];

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not set in .env");
    }
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected — seeding products...");


    for (const p of sampleProducts) {
      const filter = { sku: p.sku };
      const update = { $set: p };
      const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
      await Product.findOneAndUpdate(filter, update, opts);
      console.log("Upserted:", p.sku);
    }

    console.log("Seeding complete.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();