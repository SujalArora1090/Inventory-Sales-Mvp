// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import { protect } from "../Middleware/authMiddleware.js";
// import { isAdmin } from "../Middleware/roleMiddleware.js";



// const router = express.Router();
// const users=[]

// router.post("/forgot-password",async(req,res)=>{
//   const{email}=req.body

//   const user=await User.findOne({email})
//   if(!user){
//     return res.status(404).json({message:"user not found"})
//   }



//   const token = jwt.sign(
//   { id: user._id, canManageProducts: user.canManageProducts },
//   process.env.JWT_SECRET,
//   { expiresIn: "7d" }
// );

//   user.resetToken=token
//   user.resetTokenExpiry=Date.now()+15*60*1000
//   await user.save()

//   res.json({message:"token saved",token})
// })

// router.post("/reset-password",async(req,res)=>{
//   const{token,newPassword}=req.body

//   try{
//     const decoded=jwt.verify(token,process.env.JWT_SECRET)
//     const user=await User.findById(decoded.id)

//     if(!user || user.resetToken!==token || user.resetTokenExpiry<Date.now()){
//          return res.status(400).json({ message: "Invalid or expired token" });
//     }

//      user.password = await bcrypt.hash(newPassword, 10);
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;
//     await user.save();
//     console.log("Decoded:", decoded);


    
//     res.json({ message: "Password reset successful" });
//   } catch (err) {
//     res.status(400).json({ message: "Token invalid or expired" });
  
//   }
  
// })





// router.post("/register", async (req, res) => {
//   const { username, email,password,role } = req.body;
   

  
//   try {
     
//     const existingUser = await User.findOne({ email});
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({ username,email, password: hashedPassword, role: role || "staff"  });
//     await newUser.save();
//    const token = jwt.sign({ id: newUser._id,role:newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.status(201).json({ user: newUser.username,  role:newUser.role,token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
//     res.status(200).json({ user: user.username, token,role:user.role });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;



import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../Middleware/authMiddleware.js";

const router = express.Router();

// 🔑 Forgot Password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  res.json({ message: "Reset token generated", token });
});

// 🔑 Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ message: "Token invalid or expired" });
  }
});

// 📝 Register
router.post("/register", async (req, res) => {
  const { username, email, password, canManageProducts } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      canManageProducts: !!canManageProducts  // ✅ flag use kar rahe
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

// 🔓 Login
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


