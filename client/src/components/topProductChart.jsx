import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function TopProductsChart() {
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    loadTopProducts();
  }, []);

  const loadTopProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sales/top-products");
      const data = res.data.data || [];
      setLabels(data.map((item) => item.name));
      setValues(data.map((item) => item.totalQty));
    } catch (err) {
      console.error("❌ Error fetching top products:", err.message);
    }
  };

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#3B82F6", 
          "#22C55E", 
          "#FACC15", 
          "#EF4444", 
          "#A855F7", 
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow text-center">
      <h3 className="text-lg font-semibold mb-3">Top 5 Selling Products</h3>
      <div className="mx-auto" style={{width:"520px",height:"420px"}}>
      {values.length > 0 ? (
        <Doughnut data={data} />
      ) : (
        <p className="text-gray-500">No sales data available</p>
      )}
      </div>
    </div>
  );
}




