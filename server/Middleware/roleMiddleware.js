
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};

export const isStaff = (req, res, next) => {
  if (req.user.role !== "staff" && req.user.role==="admin" ){
    return res.status(403).json({ message: "Access denied: Staff only" });
  }
  next();
};

