import { BrowserRouter, Routes, Route, Link,useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import ForgotPassword from "./pages/forgotPassword.jsx";
import CreateProduct from "./components/CreateProduct.jsx";
import ProductList from "./components/ProductList.jsx";
import FrontPage from "./pages/FrontPage.jsx";
import DisplayProductsPage from "./components/DisplayProductsButton.jsx";
import NewProduct from "./components/NewSale.jsx";
import Navbar from "./pages/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Logs from "./pages/logs.jsx";
import Dashboard from "./pages/LowStock.jsx";
import SalesList from "./pages/saleList.jsx";
import NewSale from "./components/NewSale.jsx";




function App() {
  return (
    <BrowserRouter>
      {/* Navigation menu */}
      {/* <nav style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <Link to="/">🏠 Home</Link>
        <Link to="/register">📝 Register</Link>
        <Link to="/login">🔑 Login</Link>
        <Link to="/forgot-password">❓ Forgot Password</Link>
        <Link to="/create-product">➕ Create Product</Link>
        <Link to="/products">📦 Product List</Link>
        <Link to="/front">📦 Front Page</Link>
        <Link to="/display">📦 Display Product</Link>
      
        
      </nav> */}
      <Navbar/>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/create-product"
          element={
            <ProtectedRoute>
          <CreateProduct onSuccess={() => {}} />
            </ProtectedRoute>
            }
        />
         <Route path="/products" element={
    <ProtectedRoute>
      <ProductList />
    </ProtectedRoute>
  } />
  <Route path="/logs" element={
    <ProtectedRoute>
      <Logs />
    </ProtectedRoute>
  }
/>
        <Route path="/front" element={<FrontPage />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/display" element={<DisplayProductsPage />} />
        <Route path="/low-stock" element={<Dashboard />} />
        <Route path="/new-sale" element={<NewSale />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;



