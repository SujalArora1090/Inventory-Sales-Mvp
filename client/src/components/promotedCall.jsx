// import React from "react";
// import axios from "axios";

// const ProtectedCall = () => {
//   const token = localStorage.getItem("token");

//   const callRoute = async (path) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/protected/${path}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       console.log(`${path} Response:`, res.data);
//     } catch (err) {
//       console.log(`${path} Error:`, err.response?.data || err.message);
//     }
//   };

//   return (
//     <div>
//       <button onClick={() => callRoute("admin")}>Call Admin Route</button>
//       <button onClick={() => callRoute("staff")}>Call Staff Route</button>
     
//     </div>
//   );
// };

// export default ProtectedCall;

import React, { useEffect, useState } from "react";
import axios from "axios";

const ProtectedCall = () => {
  const [role, setRole] = useState(null);
  const token = localStorage.getItem("token");

  // Page load pe localStorage se role set karo
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  const callRoute = async (path) => {
    if (!token) return alert("Login first");

    // Frontend role check (optional)
    if (path === "admin" && role !== "admin") return alert("You are not admin");
    if (path === "staff" && role !== "staff") return alert("You are not staff");

    try {
      const res = await axios.get(`http://localhost:5000/api/protected/${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(`${path} Response:`, res.data);
      alert(`${path} success ✅`);
    } catch (err) {
      console.log(`${path} Error:`, err.response?.data || err.message);
      alert(`${path} failed ❌`);
    }
  };

  return (
    <div>
      <h3>Welcome {role?.toUpperCase() || "User"}</h3>
      <button onClick={() => callRoute("admin")}>Call Admin Route</button>
      <button onClick={() => callRoute("staff")}>Call Staff Route</button>
    </div>
  );
};

export default ProtectedCall;


