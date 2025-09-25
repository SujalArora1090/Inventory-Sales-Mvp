import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// export default function ResetPassword() {
 
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");
//   const [token, setToken] = useState(""); 



//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`http://localhost:5000/api/auth/reset-password`, {
//         token,
//         newPassword: password
//       });
//       setMsg(res.data.message);
//     } catch (err) {
//       setMsg(err?.response?.data?.message || "Error occurred");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Reset Password</h2>
//       <form onSubmit={submit}>
//         <input
//           type="password"
//           placeholder="New password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Set Password</button>
//       </form>
//       {msg && <p>{msg}</p>}
//     </div>
//   );
// }

export default function ResetPassword({ token }) {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    console.log("Sending token:", token); // ✅ debug
    try {
      const res = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,         
        newPassword: password
      });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={submit}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Set Password</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}

