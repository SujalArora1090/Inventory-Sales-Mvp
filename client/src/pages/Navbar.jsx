import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");   // remove token
    navigate("/login");                 // redirect to login page
  };

  return (
    <nav style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
      <Link to="/">🏠 Home</Link>

      {!token ? (
        <>
          <Link to="/register">📝 Register</Link>
          <Link to="/login">🔑 Login</Link>
          <Link to="/forgot-password">❓ Forgot Password</Link>
        </>
      ) : (
        <>
          <Link to="/create-product">➕ Create Product</Link>
          <Link to="/low-stock">Low-stock</Link>
          <Link to="/products">📦 Product List</Link>
          <Link to="/logs" className="ml-4">Logs</Link>
          <Link to="/front">📦 Front Page</Link>
          <Link to="/display">📦 Display Product</Link>
          <button
            onClick={handleLogout}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
            }}
          >
            🚪 Logout
          </button>
        </>
      )}
    </nav>
  );
}
