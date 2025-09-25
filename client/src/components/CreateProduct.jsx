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
    const res=await API.post("/", {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      reorderLevel: Number(formData.reorderLevel),
    });

    if(res.data.message?.includes("cannot manage")) {
    alert(res.data.message);
    return;}
    
    

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
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} />
      <input name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} />
      <input name="reorderLevel" type="number" placeholder="Reorder Level" value={formData.reorderLevel} onChange={handleChange} />
      <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      <button type="submit">Create Product</button>
    </form>
  );
};

export default CreateProduct;
