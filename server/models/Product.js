
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
  category: { type: String, default: "General", trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  reorderLevel: { type: Number, default: 5, min: 0 },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


function isLowStock(product) {
  return product.quantity <= product.reorderLevel;
}

export default mongoose.model("Product", productSchema);

