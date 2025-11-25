import React, { useState } from "react";
import axios from "axios";

export default function ForgotPasswordSimple() {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
        answer,
        newPassword,
      });
      setMsg(res.data.message);
      setEmail("");
      setAnswer("");
      setNewPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Forgot Password(Simple)
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Security Answer"
            className="border p-2 rounded"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="border p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Reset Password
          </button>
        </form>
        {msg && <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>}
      </div>
    </div>
  );
}


