
import { useState } from "react";
import axios from "axios";
import ResetPassword from "./ResetPassword";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.token) setToken(res.data.token);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400 }}>
      <h2>Forgot Password (DEV)</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Generate Reset Token</button>
      </form>
      {message && <p style={{ marginTop: 12 }}>{message}</p>}
      {token && <ResetPassword token={token} />}
    </div>
  );
}

