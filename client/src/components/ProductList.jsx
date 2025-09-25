


// import { useEffect, useState } from "react";
// import API from "../utils/api";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [editData, setEditData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
  
//   const itemsPerPage = 10;


//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const res = await API.get("/");
//       setProducts(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this product?")) return;
//     try {
//       await API.delete(`/${id}`);
//       alert("🗑️ Product deleted");
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const startEdit = (product) => {
//     setEditingId(product._id);
//     setEditData(product);
//   };

//   const handleEditChange = (e) => {
//     setEditData({ ...editData, [e.target.name]: e.target.value });
//   };

//   const saveEdit = async () => {
//     try {
//       await API.put(`/${editingId}`, {
//         ...editData,
//         price: Number(editData.price),
//         quantity: Number(editData.quantity),
//       });
//       setEditingId(null);
//       alert("Item Updated Successfully")
//       fetchProducts();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Filter products
//   const filteredProducts = products.filter((p) =>
//     [p.name, p.sku, p.category].some((field) =>
//       field?.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const indexOfLast = currentPage * itemsPerPage;
// const indexOfFirst = indexOfLast - itemsPerPage;
// const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);



//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-2">📦 Product List</h2>
      

//       {/* Search input */}
//       <input
//         type="text"
//         placeholder="🔍 Search by name, SKU, category"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="border p-2 mb-4 w-full max-w-md rounded"
//       />

//       {/* Product list */}
//       {filteredProducts.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         currentProducts.map((p) => (
//           <div key={p._id} className="mb-2 border p-2 rounded">
//             {editingId === p._id ? (
//               <div className="flex gap-2">
//                 <input
//                   name="name"
//                   value={editData.name}
//                   onChange={handleEditChange}
//                   className="border p-1 rounded"
//                 />
//                 <input
//                   name="price"
//                   type="number"
//                   value={editData.price}
//                   onChange={handleEditChange}
//                   className="border p-1 rounded"
//                 />
//                 <button onClick={saveEdit} className="px-2 py-1 bg-green-500 text-white rounded">
//                   Save
//                 </button>
//                 <button
//                   onClick={() => setEditingId(null)}
//                   className="px-2 py-1 bg-gray-300 rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             ) : (
//               <div className="flex justify-between items-center">
//                 <p>
//                   <b>{p.name}</b> | {p.category} | Rs {p.price} | Qty: {p.quantity}
//                 </p>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => startEdit(p)}
//                     className="px-2 py-1 bg-yellow-400 rounded"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(p._id)}
//                     className="px-2 py-1 bg-red-500 text-white rounded"
//                   >
//                     Delete
//                   </button>
                  
//                 </div>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//       <div className="flex gap-2 mt-4">
//   <button
//     onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//     disabled={currentPage === 1}
//     className="px-3 py-1 bg-gray-300 rounded"
//   >
//     Prev
//   </button>
//   <span>Page {currentPage}</span>
//   <button
//     onClick={() =>
//       setCurrentPage((prev) =>
//         prev < Math.ceil(filteredProducts.length / itemsPerPage) ? prev + 1 : prev
//       )
//     }
//     disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
//     className="px-3 py-1 bg-gray-300 rounded"
//   >
//     Next
//   </button>
// </div>

//     </div>
//   );
// };

// export default ProductList;


import { useEffect, useState } from "react";
import API from "../utils/api";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/${id}`);
      alert("🗑️ Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditData(product);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    try {
      await API.put(`/${editingId}`, {
        ...editData,
        price: Number(editData.price),
        quantity: Number(editData.quantity),
      });
      setEditingId(null);
      alert("Item Updated Successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) =>
    [p.name, p.sku, p.category].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">📦 Product List</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="🔍 Search by name, SKU, category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 mb-4 w-full max-w-md rounded"
      />

      {/* Conditional rendering */}
      {loading ? (
        <p>⏳ Loading...</p>
      ) : error ? (
        <div>
          <p>{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Retry
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          {currentProducts.map((p) => (
            <div key={p._id} className="mb-2 border p-2 rounded">
              {editingId === p._id ? (
                <div className="flex gap-2">
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="border p-1 rounded"
                  />
                  <input
                    name="price"
                    type="number"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="border p-1 rounded"
                  />
                  <button
                    onClick={saveEdit}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p>
                    <b>{p.name}</b> | {p.category} | Rs {p.price} | Qty:{" "}
                    {p.quantity}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-2 py-1 bg-yellow-400 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages ? prev + 1 : prev
                )
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
