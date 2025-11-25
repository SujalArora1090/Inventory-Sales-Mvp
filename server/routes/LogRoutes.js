

import express from "express";
import ActivityLog from "../models/ActivityLog.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();


router.get("/",protect, async (req, res) => {
  const logs = await ActivityLog.find()
    .populate("user", "username email")
    .populate("product", "name")
    .sort({ createdAt: -1 });
  res.json(logs);
});

export default router;
