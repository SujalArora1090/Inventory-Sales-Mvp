import React from "react";
import RevenueChart from "../components/RevenueChart";
import TopProductsChart from "../components/topProductChart";


export default function Board() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">📊 Dashboard Overview</h2>
      <RevenueChart />
      <TopProductsChart/>
    </div>
  );
}
