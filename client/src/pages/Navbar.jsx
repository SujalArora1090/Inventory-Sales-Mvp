// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");   // remove token
//     navigate("/login");                 // redirect to login page
//   };

//   return (
//     <nav className="bg-blue-600 text-white p-4">
//       <div className="max-w-6xl mx-auto flex items-center justify-between">
//       <Link to="/" className="text-xl font-bold">🏠 Home</Link>

//       <div className="hidden md:flex gap-6 items-center">
//       {!token ? (
//         <>
//           <Link to="/register" className="hover:underline">📝 Register</Link>
//           <Link to="/login" className="hover:underline">🔑 Login</Link>
//           <Link to="/forgot-password" className="hover:underline">❓ Forgot Password</Link>
//         </>
//       ) : (
//         <>
//           <Link to="/create-product" className="hover:underline">➕ Create Product</Link>
//           <Link to="/low-stock" className="hover:underline">Low-stock</Link>
//           <Link to="/products" className="hover:underline">📦 Product List</Link>
//           <Link to="/logs" className=" hover:underline">Logs</Link>
//           <Link to="/front" className="hover:underline">📦 Front Page</Link>
//           <Link to="/display" className="hover:underline" >📦 Display Product</Link>
         
//           <button
//             onClick={handleLogout}
//             style={{
//               background: "red",
//               color: "white",
//               border: "none",
//               padding: "5px 10px",
//               cursor: "pointer",
//               borderRadius: "5px",
//             }}
//           >
//             🚪 Logout
//           </button>
//         </>
        
//       )}
//       </div>
      
//       </div>
//     </nav>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    alert("Logout Successful ✅");
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        <Link to="/" className="text-xl font-bold">
          🏠 Home
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          {!token ? (
            <>
              <Link to="/register" className="hover:underline">
                📝 Register
              </Link>
              <Link to="/login" className="hover:underline">
                🔑 Login
              </Link>
              <Link to="/forgot-password" className="hover:underline">
                ❓ Forgot Password
              </Link>
            </>
          ) : (
            <>
              <Link to="/create-product" className="hover:underline">
                ➕ Create Product
              </Link>
              <Link to="/low-stock" className="hover:underline">
                Low-stock
              </Link>
              <Link to="/products" className="hover:underline">
                📦 Product List
              </Link>
              <Link to="/logs" className="hover:underline">
                📝 Logs
              </Link>
               <Link to="/new-sale" className="hover:underline">
                📦 New Sale
              </Link>
              <Link to="/front" className="hover:underline">
                📦 Front Page
              </Link>
              <Link to="/sales" className="hover:underline">
                📦 Sale List
              </Link>
              <Link to="/display" className="hover:underline">
                📦 Display Product
              </Link>
             

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>

        
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 bg-blue-700 p-3 rounded">
          {!token ? (
            <>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                📝 Register
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                🔑 Login
              </Link>
              <Link to="/forgot-password" onClick={() => setMenuOpen(false)}>
                ❓ Forgot Password
              </Link>
            </>
          ) : (
            <>
              <Link to="/create-product" onClick={() => setMenuOpen(false)}>
                ➕ Create Product
              </Link>
              <Link to="/low-stock" onClick={() => setMenuOpen(false)}>
                Low-stock
              </Link>
              <Link to="/products" onClick={() => setMenuOpen(false)}>
                📦 Product List
              </Link>
              <Link to="/logs" onClick={() => setMenuOpen(false)}>
                📝 Logs
              </Link>
              <Link to="/front" onClick={() => setMenuOpen(false)}>
                📦 Front Page
              </Link>
              <Link to="/display" onClick={() => setMenuOpen(false)}>
                📦 Display Product
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 px-3 py-1 rounded mt-2"
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
