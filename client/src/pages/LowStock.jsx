// import API from "../utils/api";
// const [lowStockProducts, setLowStockProducts] = useState([]);

// useEffect(() => {
//   fetchLowStock();
// }, []);

// const fetchLowStock = async () => {
//   try {
//     const res = await API.get("/low-stock");
//     setLowStockProducts(res.data);
//   } catch (err) {
//     console.error(err);
//   }
// };

// {/* <div className="border p-4 rounded mb-4 bg-yellow-100">
//   <h3 className="text-lg font-semibold">⚠️ Low Stock Alerts</h3>
//   <p>Total Products Low on Stock: {lowStockProducts.length}</p>
// </div> */}

// <div className="border p-4 rounded bg-white">
//   <h3 className="text-lg font-semibold mb-2">📦 Products Low on Stock</h3>
//   {lowStockProducts.length === 0 ? (
//     <p>All products are sufficiently stocked ✅</p>
//   ) : (
//     <ul className="list-disc pl-5">
//       {lowStockProducts.map((p) => (
//         <li key={p._id}>
//           {p.name} | Qty: {p.quantity} | Reorder Level: {p.reorderLevel}
//         </li>
//       ))}
//     </ul>
//   )}
// </div>


import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Dashboard() {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  // Fetch low-stock products on component mount
  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const res = await API.get("/low-stock");
      setLowStockProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      
      <div className="border p-4 rounded mb-4 bg-yellow-100">
        <h3 className="text-lg font-semibold">⚠️ Low Stock Alerts</h3>
        <p>Total Products Low on Stock: {lowStockProducts.length}</p>
      </div>

      {/* Low-stock products list */}
      <div className="border p-4 rounded bg-white">
        <h3 className="text-lg font-semibold mb-2">📦 Products Low on Stock</h3>
        {lowStockProducts.length === 0 ? (
          <p>All products are sufficiently stocked ✅</p>
        ) : (
          <ul className="list-disc pl-5">
            {lowStockProducts.map((p) => (
              <li key={p._id}>
                {p.name} | Qty: {p.quantity} | Reorder Level: {p.reorderLevel}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}




