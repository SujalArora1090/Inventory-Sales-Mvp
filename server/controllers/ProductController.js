// import { CreateLog } from "../Utils/CreateLog";
// import Product from "../models/Product";


// const createProduct=async (req,res)=>{
//     const product=await Product.create(req.body)

//     await CreateLog({
//         userId:req.user._id,
//         action:"CREATE_Product",
//         productId:product._id
//     })
//     res.json(product)
// }

// const updateProduct=async (req,res)=>{
//     const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})

//     await CreateLog({
//         userId:req.user._id,
//         action:"UPDATE_Product",
//         productId:product._id
//     })
//     res.json(product)
// }

// const DeleteProduct=async (req,res)=>{
//     const product=await Product.findByIdAndDelete(req.params.id)

//     await CreateLog({
//         userId:req.user._id,
//         action:"DELETE_Product",
//         productId:product._id
//     })
//     res.json({message:"Deleted"})
// }

import Product from "../models/Product.js";
import { CreateLog } from "../Utils/CreateLog.js";
import ActivityLog from "../models/ActivityLog.js";
import { logAction } from "../Middleware/authMiddleware.js";

// CREATE Product
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

// UPDATE Product
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

// DELETE Product
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


// import Product from "../models/Product.js";

// // CREATE Product
// export const createProduct = async (req, res) => {
//   try {
//     const product = await Product.create(req.body);
//     res.locals.entityId = product._id; // middleware ke liye pass
//     res.status(201).json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // UPDATE Product
// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // DELETE Product
// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

