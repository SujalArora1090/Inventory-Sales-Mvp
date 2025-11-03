import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import ActivityLog from "../models/ActivityLog.js";


export const createSale = async (req, res) => {
    const session=await mongoose.startSession();
    session.startTransaction();
  try {
    const { items, customer, createdBy } = req.body;


    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array required" });
    }

    let total = 0;

  
    for (const item of items) {
      const product = await Product.findById(item.product).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.quantity}`,
        });
      }

     
      item.priceAtSale = item.priceAtSale || product.price;
      total += item.priceAtSale * item.quantity;

    
      product.quantity -= item.quantity;
      await product.save({session});
    }

    await ActivityLog.create({
        action:"SALE_CREATED",
        details:`${items.length} item(s) sold to ${customer.name} | total:INR${total}`,
        user:createdBy || null,
        product:items[0].product,
    })


    
    const sale = new Sale({
      items,
      total,
      customer,
      createdBy,
    });

    const savedSale = await sale.save({session});
    await session.commitTransaction();
    session.endSession();

    await ActivityLog.create({
        action:"SALE_CREATED",
        details:`${items.length} item(s) sold to ${customer.name} | total:INR${total}`,
        user:createdBy || null,
        product:items[0].product,
    })


    
    const populatedSale = await Sale.findById(savedSale._id)
      .populate("items.product", "name sku price")
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Sale created successfully",
      sale: populatedSale,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession()
    console.error("❌ Error creating sale:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const listSales = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       product: productId,
//       user: userId,
//       from,
//       to,
//       sortBy = "createdAt",
//       order = "desc"
//     } = req.query;

//     const pageNum = Math.max(1, parseInt(page, 10) || 1);
//     const lim = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));

//     // Build filter
//     const filter = {};

//     // filter by createdBy / user
//     if (userId) filter.createdBy = userId;

//     // date range filter using createdAt
//     if (from || to) {
//       filter.createdAt = {};
//       if (from) filter.createdAt.$gte = new Date(from);
//       if (to) {
//         // set time to end of day for inclusive behaviour if only date provided
//         const toDate = new Date(to);
//         toDate.setHours(23, 59, 59, 999);
//         filter.createdAt.$lte = toDate;
//       }
//     }

//     // filter by product inside items array
//     if (productId) {
//       // sales that have at least one item.product == productId
//       filter["items.product"] = productId;
//     }

//     // Count total
//     const totalCount = await Sale.countDocuments(filter);

//     // Sorting
//     const sortOrder = order === "asc" ? 1 : -1;
//     const sortObj = { [sortBy]: sortOrder };

//     // Query with pagination + populate
//     const sales = await Sale.find(filter)
//       .sort(sortObj)
//       .skip((pageNum - 1) * lim)
//       .limit(lim)
//       .populate("items.product", "name sku price")
//       .populate("createdBy", "name email");

//     return res.json({
//       meta: {
//         total: totalCount,
//         page: pageNum,
//         limit: lim,
//         pages: Math.ceil(totalCount / lim),
//       },
//       data: sales,
//     });
//   } catch (err) {
//     console.error("❌ Error listing sales:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

export const listSales = async (req, res) => {
  try {
   
    const sales = await Sale.find()
      .sort({ createdAt: -1 }) 
      .populate("items.product", "name sku price")
      .populate("createdBy", "name email");

    res.json({
      message: "All sales fetched successfully",
      count: sales.length,
      data: sales,
    });
  } catch (err) {
    console.error("❌ Error fetching sales:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRevenueSummary = async (req, res) => {
  try {
    // ✅ Step 1: Aaj ka date aur time le
    const now = new Date();

    // ✅ Step 2: Different time ranges define kar
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday se start
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ✅ Step 3: Daily total
    const dailyTotal = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    // ✅ Step 4: Weekly total
    const weeklyTotal = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    // ✅ Step 5: Monthly total
    const monthlyTotal = await Sale.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    // ✅ Step 6: Response bhej
    res.json({
      dailyRevenue: dailyTotal[0]?.total || 0,
      weeklyRevenue: weeklyTotal[0]?.total || 0,
      monthlyRevenue: monthlyTotal[0]?.total || 0,
    });
  } catch (err) {
    console.error("❌ Error fetching summary:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({}, "name price sku");
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const cancelSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("items.product");
    if (!sale) return res.status(404).json({ message: "Sale not found" });

    if (sale.status === "Cancelled") {
      return res.status(400).json({ message: "Sale already cancelled" });
    }

    // 🧾 Update each product stock
    for (const item of sale.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: item.quantity },
      });
    }

    sale.status = "Cancelled";
    await sale.save();

    res.json({ message: "Sale cancelled and stock restored!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
