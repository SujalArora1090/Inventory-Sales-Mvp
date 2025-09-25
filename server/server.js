import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import { isAdmin } from "./Middleware/roleMiddleware.js";
import { isStaff } from "./Middleware/roleMiddleware.js";
import productRoutes from "./routes/ProductRoutes.js"
import logRoutes from "./routes/LogRoutes.js";






const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }))



app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/products", productRoutes);
app.use("/api/logs",logRoutes)






app.get("/", (req, res) => {
  res.send("Backend running fine with MongoDB connection!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log(err));

  





