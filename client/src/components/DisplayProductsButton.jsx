


import React, { useEffect, useState } from "react";

export default function DisplayProductsPage() {
  const [products, setProducts] = useState([]);
  const [sellProductId, setSellProductId] = useState(null); 
  const [quantitySold, setQuantitySold] = useState(""); 

 
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

  
  const handleSell = async (productId) => {
    if (!quantitySold || quantitySold <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${productId}/reduce-stock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ quantitySold: Number(quantitySold) }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        if (data.lowStockAlert) alert(data.lowStockAlert);

        
        setProducts((prev) =>
          prev.map((p) => (p._id === data.product._id ? data.product : p))
        );

        setSellProductId(null);
        setQuantitySold("");
      } else {
        alert(data.message || "Sale failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error reducing stock");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">
        Product List
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products available</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 break-words"
            >
              <div className="mb-2 sm:mb-0 w-full">
                <p className="font-semibold text-base sm:text-lg">{p.name}</p>
                <p className="text-sm text-gray-600">
                  {p.category} — ₹{p.price} — Stock:{" "}
                  <span
                    className={`font-semibold ${
                      p.quantity <= p.reorderLevel
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {p.quantity}
                  </span>
                </p>
              </div>

              
              {sellProductId === p._id ? (
                <div className="w-full mt-3">
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={quantitySold}
                    onChange={(e) => setQuantitySold(e.target.value)}
                    className="border p-2 rounded w-full mb-2 text-sm"
                  />
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleSell(p._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setSellProductId(null);
                        setQuantitySold("");
                      }}
                      className="bg-gray-300 text-black px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSellProductId(p._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded mt-3 text-sm"
                >
                  Sell
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
