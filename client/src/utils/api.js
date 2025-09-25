// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/products",
 

//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`, 
//   },
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/products",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

// const API = axios.create({
//   baseURL: "http://localhost:5000/api/products",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // har request se pehle token attach karne ke liye interceptor
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
// export default API;

