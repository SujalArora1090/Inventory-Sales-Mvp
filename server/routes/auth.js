import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../Middleware/authMiddleware.js";
import crypto from "crypto"
import nodemailer from "nodemailer"

const router = express.Router();


router.post("/set-security", async (req, res) => {
  const { email, question, answer } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.securityQuestion = question;
  user.securityAnswer = answer; 
  await user.save();

  res.json({ message: "Security question saved ✅" });
});


   

router.post("/forgot-password", async (req, res) => {
  const { email, answer, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  
  if (answer !== user.securityAnswer)
    return res.status(400).json({ message: "Incorrect answer ❌" });

  
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password reset successfully ✅" });
});


   
router.post("/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(oldPassword, user.password);
  if (!valid) return res.status(400).json({ message: "Old password incorrect" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password changed successfully 🔄" });
});


router.post("/register", async (req, res) => {
  console.log(" Received body:", req.body);
  const { username, email, password, securityQuestion,securityAnswer } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      securityQuestion,
      securityAnswer
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      user: newUser.username,
      canManageProducts: newUser.canManageProducts,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      user: user.username,
      token,
      canManageProducts: user.canManageProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;


