import { BrowserRouter, Routes, Route, Link,useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
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
import RevenueChart from "./components/RevenueChart.jsx";
import Board from "./pages/Dashboard.jsx";





function App() {
  return (
    
    <BrowserRouter>
      
      <Navbar/>

      
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
        <Route path="/revenue-chart" element={<Board />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;



