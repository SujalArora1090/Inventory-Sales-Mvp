import React, { useEffect, useState } from "react";

export default function DisplayProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    
    fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Product List</h1>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <li
              key={p._id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-600">
                  {p.category} — ₹{p.price} — Stock: {p.stock}
                </p>
              </div>

              {/* <div className="space-x-2">
                <button className="px-3 py-1 bg-yellow-500 text-white rounded">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded">
                  Delete
                </button> */}
              {/* </div> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

