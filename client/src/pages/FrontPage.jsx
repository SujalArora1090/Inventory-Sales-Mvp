import React from "react";
import { Link } from "react-router-dom";

export default function FrontPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Inventory Management</h1>

      <div className="grid grid-cols-1 gap-4 w-60">
        <Link
          to="/register"
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-center hover:bg-green-700"
        >
          Register
        </Link>

        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          to="/forgot-password"
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-center hover:bg-yellow-600"
        >
          Forgot Password
        </Link>

        <Link
          to="/create-product"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg text-center hover:bg-purple-700"
        >
          Create Product
        </Link>

        <Link
          to="/products"
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-center hover:bg-red-700"
        >
          Product List
        </Link>
      </div>
    </div>
  );
}
