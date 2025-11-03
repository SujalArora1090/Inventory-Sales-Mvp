// import mongoose from "mongoose";

// const activityLogSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   action: { type: String, required: true },
//   product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//   timestamp: { type: Date, default: Date.now }
// });

// const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

// export default ActivityLog;

import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  details:{type:String},
  meta:mongoose.Schema.Types.Mixed,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
}, { timestamps: true });

export default mongoose.model("ActivityLog", activityLogSchema);
