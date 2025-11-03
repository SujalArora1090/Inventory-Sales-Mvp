import express from "express";
import { createSale,listSales,getRevenueSummary,listProducts } from "../controllers/saleControllers.js";
import { protect } from "../Middleware/authMiddleware.js";
import { cancelSale } from "../controllers/saleControllers.js";


const router = express.Router();

// POST /api/sales → new sale create karega
router.post("/",protect, createSale);
router.get("/",protect,listSales)
router.get("/summary",protect, getRevenueSummary);
router.get("/",protect, listProducts);
router.put("/:id/cancel", cancelSale);



export default router;
