import { useEffect, useState } from "react";
import API from "../utils/api";   // utils se import

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("")

  const fetchProducts = async () => {
    try {
      const res = await API.get("/");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/${id}`);
      alert("🗑️ Product deleted (soft)");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting");
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
        reorderLevel: Number(editData.reorderLevel),
      });
      alert("✏️ Product updated");
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("❌ Error updating");
    }
  };

  const filteredProducts = products.filter((p) =>
  [p.name, p.sku, p.category].some((field) =>
    field?.toLowerCase().includes(searchTerm.toLowerCase())
  )
);


  return (
    <div>
      <h2>📦 Product List</h2>
      <input
  type="text"
  placeholder="🔍 Search by name, SKU, category"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
   className="border p-2 mb-4 w-full max-w-md rounded"
/>

   {filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        filteredProducts.map((p) => (
          <div key={p._id} className="mb-2 border p-2 rounded">
            {editingId === p._id ? (
              <div className="flex gap-2 flex-wrap">
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
                <input
                  name="quantity"
                  type="number"
                  value={editData.quantity}
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
                  <b>{p.name}</b> | {p.category} | Rs {p.price} | Qty: {p.quantity}
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
        ))
      )}
    </div>
  );
};

export default ProductList;




     