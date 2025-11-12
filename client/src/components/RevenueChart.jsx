import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RevenueChart() {
  const [summary, setSummary] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [chartData, setChartData] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetchSummary();
    fetchWeeklyData();
  }, []);


  const fetchSummary = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/sales/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSummary({
      daily: res.data.dailyRevenue,
      weekly: res.data.weeklyRevenue,
      monthly: res.data.monthlyRevenue,
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
  }
};

const fetchWeeklyData = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/sales/weekly-trend", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const days = res.data.data.map((d) => d.day);
    const values = res.data.data.map((d) => d.revenue);
    setChartData({ labels: days, data: values });
  } catch (err) {
    console.error("Error fetching chart data:", err);
  }
};


  
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: chartData.data,
        backgroundColor: "rgba(59, 130, 246, 0.6)", 
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Weekly Revenue Trend", font: { size: 16 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#4b5563" },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#4b5563" },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mb-6">
        <div className="p-3 bg-gray-50 rounded shadow">
          <h4 className="text-gray-500 text-sm">Today</h4>
          <p className="text-2xl font-bold text-green-600">₹{summary.daily}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded shadow">
          <h4 className="text-gray-500 text-sm">This Week</h4>
          <p className="text-2xl font-bold text-indigo-600">₹{summary.weekly}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded shadow">
          <h4 className="text-gray-500 text-sm">This Month</h4>
          <p className="text-2xl font-bold text-blue-600">₹{summary.monthly}</p>
        </div>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
}
