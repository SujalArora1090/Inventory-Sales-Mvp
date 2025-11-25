import mongoose from "mongoose";
import dotenv from "dotenv";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected (seedSales)");
  } catch (err) {
    console.error("❌ Error connecting DB:", err.message);
    process.exit(1);
  }
};

const seedSales = async () => {
  try {
    await connectDB();


    const products = await Product.find().limit(2);
    const user = await User.findOne();

    if (products.length === 0) {
      console.log("⚠️ No products found! Please seed products first.");
      process.exit(1);
    }

  
    const saleData = [
      {
        items: [
          {
            product: products[0]._id,
            quantity: 3,
            priceAtSale: products[0].price,
          },
        ],
        total: products[0].price * 3,
        customer: { name: "Aman Kumar", email: "aman@example.com" },
        createdBy: user ? user._id : null,
      },
      {
        items: [
          {
            product: products[1]._id,
            quantity: 2,
            priceAtSale: products[1].price,
          },
        ],
        total: products[1].price * 2, 
        customer: { name: "Sujal Arora", email: "sujal@example.com" },
        createdBy: user ? user._id : null,
      },
    ];

    
    await Sale.deleteMany();
    console.log("🧹 Old sales cleared.");

  
    const inserted = await Sale.insertMany(saleData);
    console.log(`✅ ${inserted.length} sales added successfully.`);

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding sales:", err);
    process.exit(1);
  }
};

seedSales();


