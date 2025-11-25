


import { useState } from "react";
import axios from "axios";

import ForgotPasswordSimple from "./ResetPassword";
export default function ChangePassword() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/change-password", {
        email,
        oldPassword,
        newPassword,
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Change Password</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Change Password
        </button>
        {msg && <p className="mt-3 text-center text-sm text-gray-600">{msg}</p>}
         
      </form>
      <ForgotPasswordSimple/>
    </div>
  );
}


