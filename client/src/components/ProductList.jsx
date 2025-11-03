


import { useEffect, useState } from "react";
import API from "../utils/api";
import BulkCsv from "./Bulkcsv";

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
    <h2 className="text-xl md:text-2xl font-bold mb-2">📦 Product List</h2>

    <BulkCsv />

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
        {/* ✅ Proper responsive grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentProducts.map((p) => (
            <div
              key={p._id}
              className="border p-3 rounded-lg shadow-sm hover:shadow-md transition"
            >
              {editingId === p._id ? (
                <div className="flex flex-col gap-2">
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full"
                  />
                  <input
                    name="price"
                    type="number"
                    value={editData.price}
                    onChange={handleEditChange}
                    className="border p-1 rounded w-full"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={saveEdit}
                      className="flex-1 px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 px-2 py-1 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <p className="text-sm">
                    <b>{p.name}</b>
                  </p>
                  <p className="text-sm">
                    {p.category} | ₹{p.price} | Qty: {p.quantity}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="flex-1 bg-yellow-400 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex-1 bg-red-500 text-white py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ✅ Pagination */}
        <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
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
