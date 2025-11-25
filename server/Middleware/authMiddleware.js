
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "❌ User not found" });
      }

      req.user = user; 
      console.log("🔑 req.user in protect:", req.user); 

      next(); 
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "❌ Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "❌ Not authorized, no token" });
  }
};






export const logAction = (entity, action) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await CreateLog({
          userId: req.user?._id,  
          action,
          entity,
          entityId: req.params.id || res.locals.entityId,
          meta: { body: req.body },
        });
      }
    });
    next();
  };
};








