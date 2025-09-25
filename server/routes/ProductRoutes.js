// import express from "express";
// import Product from "../models/Product.js";
// import { admin, protect } from "../Middleware/authMiddleware.js";
// import { isAdmin } from "../Middleware/roleMiddleware.js";
// import { checkProductAccess } from "../Middleware/authMiddleware.js";


// const router = express.Router();


// router.post("/",protect,checkProductAccess, async (req, res) => {
//   try {
//     const { name, sku, category, price, quantity, reorderLevel,description } = req.body;

//     const product = new Product({ name, sku, category, price, quantity, reorderLevel,description });
//     await product.save();
//     let lowStockAlert = null;
   
//       if (product.quantity <= product.reorderLevel) {
//   lowStockAlert = `⚠️ Product ${product.name} is low on stock!`;
// }

// res.status(201).json({
//   message: "Product created successfully",
  
//   product,
//   lowStockAlert
// });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }


// });


// router.get("/", async (req, res) => {
//   try {
    
//     const products = await Product.find({ isActive: true });

//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching products" });
//   }
// });

// router.put("/:id", async (req, res) => {
//   try {
//     const { name, sku, category, price, quantity, reorderLevel, description, isActive } = req.body;
   
//     if (price != null && typeof price !== "number") return res.status(400).json({ message: "price must be a number" });
//     if (quantity != null && typeof quantity !== "number") return res.status(400).json({ message: "qty must be a number" });

//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

   
//     if (sku && sku !== product.sku) {
//       const exists = await Product.findOne({ sku });
//       if (exists) return res.status(400).json({ message: "SKU already exists" });
//       product.sku = sku;
//     }

    
//     if (name != null) product.name = name;
//     if (category != null) product.category = category;
//     if (price != null) product.price = price;
//     if (quantity != null) product.quantity = quantity;
//     if (reorderLevel != null) product.reorderLevel = reorderLevel;
//     if (description != null) product.description = description;
//     if (isActive != null) product.isActive = isActive;

//     await product.save();
//     res.json({ message: "Product updated", product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.delete("/:id",protect,checkProductAccess, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     product.isActive = false;
//     await product.save();
//     res.json({ message: "Product soft-deleted (isActive=false)" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.get("/low-stock" ,async (req, res) => {
//   try {
//     const lowStockProducts = await Product.find({
//       $expr: { $lte: ["$quantity", "$reorderLevel"] }
//     });

//     res.json(lowStockProducts);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching low stock products", error });
//   }
  
// }
// )





// export default router;

import express from "express";
import Product from "../models/Product.js";
import { protect, checkProductAccess } from "../Middleware/authMiddleware.js";
import { createProduct, updateProduct, deleteProduct } from "../controllers/ProductController.js";
import { logAction } from "../Middleware/authMiddleware.js";
import { CreateLog } from "../Utils/CreateLog.js";
import { authorize } from "../Middleware/authMiddleware.js";


const router = express.Router();




// Create Product
router.post("/",protect,async (req, res) => {
    try {
  //          if(!req.user?.canManageProducts) {
  //   return res.status(200).json({ message: "🚫 You cannot manage products" });
  // }
        
    const { name, sku, category, price, quantity, reorderLevel, description } = req.body;

    const product = new Product({
      name,
      sku,
      category,
      price: Number(price),
      quantity: Number(quantity),
      reorderLevel: Number(reorderLevel),
      description
    });
   
     
    await product.save();
    await CreateLog({
      userId: req.user._id,
      action: "CREATE_PRODUCT",
      productId: product._id
    });



    let lowStockAlert = null;
    if (product.quantity <= product.reorderLevel) {
      lowStockAlert = `⚠️ Product ${product.name} is low on stock!`;
    }


    res.status(201).json({
      message: "Product created successfully",
      product,
      lowStockAlert
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
});


router.get("/low-stock", async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] },
      isActive:true
    });
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching low stock products", error });
  }
});


router.put("/:id",protect, async (req, res) => {
  try {
    const { name, sku, category, price, quantity, reorderLevel, description, isActive } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // SKU uniqueness check
    if (sku && sku !== product.sku) {
      const exists = await Product.findOne({ sku });
      if (exists) return res.status(400).json({ message: "SKU already exists" });
      product.sku = sku;
    }

    // Update fields safely
    if (name != null) product.name = name;
    if (category != null) product.category = category;
    if (price != null) product.price = Number(price);
    if (quantity != null) product.quantity = Number(quantity);
    if (reorderLevel != null) product.reorderLevel = Number(reorderLevel);
    if (description != null) product.description = description;
    if (isActive != null) product.isActive = isActive;

    await product.save();
    Object.assign(product, req.body);
    await product.save();

    // ✅ Log create karo
    await CreateLog({
      userId: req.user._id,
      action: "UPDATE_PRODUCT",
      productId: product._id
    });
    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/:id",protect,async (req, res) => {
      

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isActive = false;
    await product.save();
      await CreateLog({
      userId: req.user._id,
      action: "DELETE_PRODUCT",
      productId: product._id
    });
    res.json({ message: "Product soft-deleted (isActive=false)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/", protect, createProduct, logAction("Product", "CREATE"));
// router.put("/:id", protect, updateProduct, logAction("Product", "UPDATE"));
// router.delete("/:id", protect, deleteProduct, logAction("Product", "DELETE"));


export default router;
