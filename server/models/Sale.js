import mongoose from "mongoose";

const saleItemSchema=new mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
    quantity: { type: Number, required: true },
    priceAtSale: { type: Number, required: true },
})

const saleSchema=new mongoose.Schema({
    items:[saleItemSchema],
    total:{type:Number,required:true},
    customer:{
        name:String,
        email:String
    },
     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
     status: { type: String, default: "Completed" },
     createdAt: { type: Date, default: Date.now },

})

export default mongoose.model("Sale",saleSchema)