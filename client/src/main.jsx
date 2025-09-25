import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import ForgotPassword from './pages/forgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ProductList from './components/ProductList.jsx'
import  ProductForm from './components/CreateProduct.jsx'


// ReactDOM.createRoot(document.getElementById('root')).render(

     
//     <BrowserRouter>
//     <App />
//       <Routes>

//         {/* <Route path="/" element={<App />} /> */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
        
        
       
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password" element={<ResetPassword />} />
        
    
//       </Routes>
//     </BrowserRouter>
 
// );


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
