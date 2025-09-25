// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect=async (req,res,next) => {
//      try{
//         const token=req.headers.authorization?.split(" ")[1];
//         if(!token){
//               return res.status(401).json({message:"No token provided"});
//         }
//         const decoded=jwt.verify(token,process.env.JWT_SECRET);

//         const user=await User.findById(decoded.id).select("role email username")
//          if(!user){
//               return res.status(401).json({message:"No user found"});
//          }

//      req.user=user;
//      next();
//         }
//      catch (error) {
//     return res.status(401).json({ message: "Not authorized" });
//      }
// }

// export const admin = (req, res, next) => {
//   if (req.user && req.user.role === "admin") {
//     next();
//   } else {
//     res.status(403).json({ message: "Not authorized as admin" });
//   }
// };


// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// // Token verify karega
// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//        console.log("decoded",decoded)
//       req.user = await User.findById(decoded.id).select("-password");
//       console.log(req.user)

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (error) {
//       return res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   } else {
//     return res.status(401).json({ message: "Not authorized, no token" });
//   }
// };

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       // Get token from header
//       token = req.headers.authorization.split(" ")[1];

//       // Verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Attach user to request (excluding password)
//       req.user = await User.findById(decoded.id).select("-password");

//       if (!req.user) {
//         return res.status(401).json({ message: "User not found" });
//       }

//       next();
//     } catch (error) {
//       console.error("❌ Token verification failed:", error);
//       res.status(401).json({ message: "Not authorized, token failed" });
//     }
//   }

//   if (!token) {
//     res.status(401).json({ message: "Not authorized, no token" });
//   }
//   if (req.headers.authorization) {
//   console.log("Auth Header:", req.headers.authorization);
// } else {
//   console.log("❌ No Auth header");
// }

// };


// // Sirf admin ke liye
// // export const admin = (req, res, next) => {
// //   if (req.user && req.user.role === "admin") {
// //     next();
// //   } else {
// //     res.status(403).json({ message: "Not authorized as admin" });
// //   }
// // };
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// middleware/checkProductAccess.js
export const checkProductAccess = (req, res, next) => {
  if (!req.user?.canManageProducts) {
    return res.status(403).json({ message: "🚫 Not allowed to manage products" });
  }
  next();
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Bearer ke baad token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "❌ User not found" });
      }

      req.user = user; // ✅ pehle assign kar
      console.log("🔑 req.user in protect:", req.user); // ✅ ab sahi value aayegi

      next(); // ✅ User mil gaya, next middleware
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "❌ Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "❌ Not authorized, no token" });
  }
};



// middlewares/logMiddleware.js


export const logAction = (entity, action) => {
  return async (req, res, next) => {
    res.on("finish", async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await CreateLog({
          userId: req.user?._id,  // token se aayega
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


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "🚫 Not allowed" });
    }
    next();
  };
};

