// import ActivityLog from "../models/ActivityLog.js";

// export const CreateLog = async ({ userId, action, productId }) => {
//   try {
//     await ActivityLog.create({
//       user: userId,
//       action,
//       product: productId,
//     });
//     console.log(" Log created:", action);
//   } catch (error) {
//     console.error("❌ Error creating log:", error.message);
//   }
// };

import ActivityLog from "../models/ActivityLog.js";

export const CreateLog = async ({ userId, action, productId }) => {
  console.log("Creating log:", { userId, action, productId });
  try {
    const log = await ActivityLog.create({
      user: userId,
      action,
      product: productId,
    });
    console.log("Log created:", log);
    return log;
  } catch (error) {
    console.error("Error creating log:", error.message);
    throw error;  // ← throw karke failure ko pakdo
  }
};

