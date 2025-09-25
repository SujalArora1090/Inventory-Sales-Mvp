import React from "react";
import { createBrowserRouter } from "react-router-dom";




const Navbar = () => {
  return (
    <div>
        <nav>
            <a href="/"><li>Home</li></a>
            <a href="/"><li>Product</li></a>
        </nav>
    </div>
  )
}

export default Navbar