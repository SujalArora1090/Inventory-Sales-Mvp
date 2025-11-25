

import Product from "../models/Product.js";
import { CreateLog } from "../Utils/CreateLog.js";
import ActivityLog from "../models/ActivityLog.js";
import { logAction } from "../Middleware/authMiddleware.js";


export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  console.log("Creating log:", req.user?._id, product?._id);

  await CreateLog({
    userId: req.user._id,
    action: "CREATE_PRODUCT",
    productId: product._id,
  });
  res.json(product);
}; 


export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
   if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  await CreateLog({
    userId: req.user._id,
    action: "UPDATE_PRODUCT",
    productId: product._id,
  });
  res.json(product);
  
};


export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  console.log("🔧 product being deleted:", product);
  console.log("Creating log for user:", req.user?._id, "action:", "DELETE_PRODUCT", "product:", product?._id);

  await CreateLog({
    userId: req.user._id,
    action: "DELETE_PRODUCT",
    productId: product._id,
  });
  res.json({ message: "Deleted" });
};



