import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password
      });

      const { token, role, user } = res.data;

      
      localStorage.setItem("token",token);
      localStorage.setItem("role",role);
      localStorage.setItem("user", res.data.user);

      console.log("Login Success:", res.data);
      alert("Welcome Login successful")
      localStorage.setItem("token", res.data.token);

      
      if (role === "admin") {
        alert(`Welcome Admin ${user}, you have admin access ✅`);
      } else if (role === "staff") {
        alert(`Welcome Staff ${user}, you have staff access ✅`);
      } else {
        alert(`Welcome ${user}, role not recognized ❌`);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Server not reachable");
    }
  };

  
   

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
     
    </form>
  );
}

