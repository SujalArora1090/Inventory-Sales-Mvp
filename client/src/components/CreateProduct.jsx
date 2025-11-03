import { useState } from "react";
import API from "../utils/api";

const CreateProduct = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    quantity: "",
    reorderLevel: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/", {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        reorderLevel: Number(formData.reorderLevel),
      });

      alert("✅ Product created successfully");

      if (res.data.lowStockAlert) {
        alert(res.data.lowStockAlert);
      }

      setFormData({
        name: "",
        sku: "",
        category: "",
        price: "",
        quantity: "",
        reorderLevel: "",
        description: "",
      });

      if (typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      console.error("❌ Error creating product:", err);
      alert("❌ Error creating product");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        ➕ Create Product
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="sku"
          placeholder="SKU"
          value={formData.sku}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        {/* Responsive side-by-side fields */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 rounded w-full sm:w-1/3"
          />
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border p-2 rounded w-full sm:w-1/3"
          />
          <input
            name="reorderLevel"
            type="number"
            placeholder="Reorder Level"
            value={formData.reorderLevel}
            onChange={handleChange}
            className="border p-2 rounded w-full sm:w-1/3"
          />
        </div>

        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full sm:w-auto hover:bg-blue-700 transition"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;

