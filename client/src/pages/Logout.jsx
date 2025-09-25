import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    alert("Logout Successful") 
    
    navigate("/login");
  };

  return (
    <nav>
    
      {localStorage.getItem("token") && (
        <button onClick={handleLogout}>Logout</button>
      )}
      </nav>
    
  );
}
