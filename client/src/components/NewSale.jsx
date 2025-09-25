import React, { useState } from "react";
import axios from "axios";

export default function NewSale() {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSale = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/sales", {
        productId,
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      alert(res.data.message); // 

      if (res.data.lowStockAlert) {
        alert(res.data.lowStockAlert);
      }

    } catch (err) {
      alert(err.response?.data?.message || "Error creating sale");
    }
  };

  return (
    <form onSubmit={handleSale} className="p-4">
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Sale
      </button>
    </form>
  );
}


