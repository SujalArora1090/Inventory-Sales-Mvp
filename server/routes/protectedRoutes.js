
import express from "express";
import { protect } from "../Middleware/authMiddleware.js";
import { isAdmin, isStaff} from "../Middleware/roleMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/admin", protect, isAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! You have full access." ,User:req.user});
});

router.get("/staff", protect, isStaff, (req, res) => {
  res.json({ message: "Welcome Staff! You have staff access.",User:req.user });
});

export default router;

