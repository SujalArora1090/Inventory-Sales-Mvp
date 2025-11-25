import express from "express";
import { createSale,listSales,getRevenueSummary,listProducts } from "../controllers/saleControllers.js";
import { protect } from "../Middleware/authMiddleware.js";
import { cancelSale } from "../controllers/saleControllers.js";
import { getSaleInvoice } from "../controllers/invoiceController.js";
import { getWeeklyTrend } from "../controllers/saleControllers.js";
import { getTopProducts } from "../controllers/saleControllers.js";



const router = express.Router();


router.post("/",protect, createSale);
router.get("/",protect,listSales)
router.get("/",protect, listProducts);
router.get("/summary",protect,getRevenueSummary);
router.get("/weekly-trend",protect,getWeeklyTrend)
router.put("/:id/cancel", cancelSale);
router.get("/:id/invoice",getSaleInvoice)
router.get("/top-products",getTopProducts)



export default router;
