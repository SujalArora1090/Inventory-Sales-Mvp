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
import { adminOnly } from "../Middleware/authMiddleware.js";


const router = express.Router();





router.post("/import", protect, async (req, res) => {
  try {
    const products = req.body; // ye array of objects hona chahiye
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Expected an array of products" });
    }

    
    const formattedProducts = products.map(p => ({
      name: p.name,
      sku: p.sku || "",
      category: p.category || "",
      price: Number(p.price),
      quantity: Number(p.quantity),
      reorderLevel: Number(p.reorderLevel) || 0,
      description: p.description || "",
      isActive: true
    }));

    const createdProducts = await Product.insertMany(formattedProducts);

    res.status(201).json({
      message: "✅ Import successful",
      importedCount: createdProducts.length
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});


// router.post("/",protect,async (req, res) => {
//     try {
//   //          if(!req.user?.canManageProducts) {
//   //   return res.status(200).json({ message: "🚫 You cannot manage products" });
//   // }
        
//     const { name, sku, category, price, quantity, reorderLevel, description } = req.body;

//     const product = new Product({
//       name,
//       sku,
//       category,
//       price: Number(price),
//       quantity: Number(quantity),
//       reorderLevel: Number(reorderLevel),
//       description
//     });
   
     
//     await product.save();
//     await CreateLog({
//       userId: req.user._id,
//       action: "CREATE_PRODUCT",
//       productId: product._id
//     });



//     let lowStockAlert = null;
//     if (product.quantity <= product.reorderLevel) {
//       lowStockAlert = `⚠️ Product ${product.name} is low on stock!`;
//     }


//     res.status(201).json({
//       message: "Product created successfully",
//       product,
//       lowStockAlert
//     });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });




router.get("/export", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).lean();
    let csv="name,price,quantity\n";
    products.forEach(p=>{
      csv+=`${p.name},${p.price},${p.quantity}\n`
    })
    res.setHeader("Content-Type","text/csv")
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.send(csv);
    // res.json(products);
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
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
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


router.put("/:id/reduce-stock",protect,  async (req, res) => {
  try {
    const { quantitySold } = req.body;
    if (!quantitySold || quantitySold <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.quantity -= quantitySold;
    await product.save();

    await CreateLog({
      userId: req.user._id,
      action: `SALE - ${quantitySold} units sold`,
      productId: product._id,
    });

    let lowStockAlert = null;
    if (product.quantity <= product.reorderLevel) {
      lowStockAlert = `⚠️ Product ${product.name} is low on stock!`;
    }

    res.json({
      message: "Stock reduced successfully",
      product,
      lowStockAlert,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reducing stock" });
  }
});


// router.post("/", protect, createProduct, logAction("Product", "CREATE"));
// router.put("/:id", protect, updateProduct, logAction("Product", "UPDATE"));
// router.delete("/:id", protect, deleteProduct, logAction("Product", "DELETE"));


export default router;
