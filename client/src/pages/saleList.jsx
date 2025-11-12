import React, { useEffect, useState } from "react";
import axios from "axios";





export default function SalesList() {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/sales", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setSales(res.data.data);
        } catch (err) {
            alert(err.response?.data?.message || "Error fetching sales");
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure to cancel this sale?")) return;
        try {
            await axios.put(`http://localhost:5000/api/sales/${id}/cancel`);
            alert("Sale cancelled!");
            fetchSales(); 
        } catch (err) {
            alert(err.response?.data?.message || "Error cancelling sale");
        }
    };


    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Sales List</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Customer</th>
                            <th className="p-2 border">Items</th>
                            <th className="p-2 border">Total</th>
                            <th className="p-2 border">Date</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Invoice</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.length > 0 ? (
                            sales.map((sale) => (
                                <tr key={sale._id} className="hover:bg-gray-50">
                                    <td className="p-2 border">{sale.customer?.name || "N/A"}</td>
                                    <td className="p-2 border">
                                        {sale.items?.map((i) => (
                                            <div key={i._id}>
                                                {i.product?.name} × {i.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-2 border font-medium">₹{sale.total}</td>
                                    <td className="p-2 border">
                                        {new Date(sale.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-2 border text-center">
                                        {sale.status === "Cancelled" ? (
                                            <span className="text-gray-500 italic">Cancelled</span>
                                        ) : (
                                            <button
                                                onClick={() => handleCancel(sale._id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                    <td className="p-2 border text-center">
                                        <button
                                            onClick={() => window.open(`http://localhost:5000/api/sales/${sale._id}/invoice`, "_blank")}
                                            className="bg-green-500 text-white px-2 py-1 rounded text-xs ml-2"
                                        >
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No sales found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    );
}


