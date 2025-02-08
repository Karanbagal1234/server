import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  Name: String,
  Price: Number,
  Quantity:Number,
  Retailer: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" },
});


export default mongoose.model('Product', ProductSchema);