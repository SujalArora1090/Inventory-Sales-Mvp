import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
   email: { type: String, unique: true,required:true },
   resetToken: String,
   resetTokenExpiry: Date,
  password: { type: String, sparse: true },
  canManageProducts: { type: Boolean, default: false },
  role:{
    type:String,
    enum:["admin","staff"],
    default:"staff",
    
  }
  
});



export default mongoose.model("User", userSchema);


