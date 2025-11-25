


import React, { useEffect, useState } from "react";
import api from "../utils/api"; 

export default function NewSale() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([{ product: "", quantity: 1, priceAtSale: 0 }]);
  const [customer, setCustomer] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const userId = localStorage.getItem("userId") || "68af48d0011e95b3c13135d1"; 
  const [gst, setGst] = useState(0);
  const [discount, setDiscount] = useState(0);


  useEffect(() => {
    
    const load = async () => {
      try {
        const res = await api.get("/");
        setProducts(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Could not load products", err);
        setProducts([]);
      }
    };
    load();
  }, []);

  
  const getPrice = (productId) => {
    const p = products.find((x) => String(x._id) === String(productId));
    return p ? Number(p.price || 0) : 0;
  };

  
  const updateItem = (index, changes) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...changes };
      
      if (changes.product !== undefined) {
        copy[index].priceAtSale = getPrice(changes.product);
      }
      
      copy[index].quantity = Number(copy[index].quantity) || 0;
      return copy;
    });
  };

  const addRow = () => setItems((s) => [...s, { product: "", quantity: 1, priceAtSale: 0 }]);
  const removeRow = (i) => setItems((s) => s.filter((_, idx) => idx !== i));

  const grandTotal = items.reduce((sum, it) => sum + (Number(it.priceAtSale || 0) * Number(it.quantity || 0)), 0);

  const validate = () => {
    if (!items.length) return "Add at least one item";
    for (const it of items) {
      if (!it.product) return "Select product for each item";
      if (!Number.isInteger(Number(it.quantity)) || Number(it.quantity) <= 0) return "Quantity must be positive integer";
    }
    if (!customer.name) return "Customer name required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return alert(err);

    const payload = {
      items: items.map((it) => ({
        product: it.product,
        quantity: Number(it.quantity),
        priceAtSale: Number(it.priceAtSale || getPrice(it.product) || 0),
      })),
      customer,
      createdBy: userId,
      gstRate:Number(gst),
      discount:Number(discount)
    };

    try {
      setSubmitting(true);
      const res = await api.post("http://localhost:5000/api/sales", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert(res.data?.message || "Sale created");
      
      setItems([{ product: "", quantity: 1, priceAtSale: 0 }]);
      setCustomer({ name: "", email: "" });
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || "Failed to create sale");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create New Sale</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Customer Email (optional)</label>
          <input
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            className="w-full border rounded p-2 mt-1"
            type="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Items</label>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <select
                  value={it.product}
                  onChange={(e) => updateItem(idx, { product: e.target.value })}
                  className="flex-1 border p-2 rounded"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} — ₹{p.price}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min="1"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                  className="w-24 border p-2 rounded text-center"
                />

                <div className="w-32 text-right">
                  <div className="text-sm text-gray-500">Item total</div>
                  <div className="font-medium">₹{(Number(it.priceAtSale || getPrice(it.product)) * Number(it.quantity || 0)).toLocaleString()}</div>
                </div>

                <button type="button" onClick={() => removeRow(idx)} className="text-red-500 p-1" aria-label="Remove item">
                  ✕
                </button>
              </div>
            ))}
          </div>
          

          <div className="mt-2">
            <button type="button" onClick={addRow} className="text-sm bg-gray-100 px-3 py-1 rounded">
              + Add product
            </button>
          </div>
        </div>
        <div className="flex">
        <div>
  <label className="text-sm">GST %</label>
  <input type="number" value={gst} onChange={(e)=>setGst(e.target.value)} className="border p-2 rounded w-24" />
</div>

<div>
  <label className="text-sm">Discount ₹</label>
  <input type="number" value={discount} onChange={(e)=>setDiscount(e.target.value)} className="border p-2 rounded w-24" />
</div>
</div>
        

        <div className="flex justify-between items-center pt-2 border-t">
          

          <div>
            <div className="text-sm text-gray-500">Grand total</div>
            <div className="text-2xl font-semibold">₹{grandTotal.toLocaleString()}</div>
          </div>
          <div className="text-sm text-gray-500">GST Amount</div>
<div className="font-medium">
  ₹{((grandTotal * gst) / 100).toFixed(2)}
</div>

<div className="text-sm text-gray-500">Discount</div>
<div className="font-medium">₹{discount}</div>

<div className="text-lg font-bold mt-2 text-green-600">
  Final: ₹{(grandTotal + (grandTotal * gst)/100 - discount).toFixed(2)}
</div>

          

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Create Sale"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}





