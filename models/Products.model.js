import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Price: { type: Number, required: true },
  Quantity: { type: Number, required: true },
  Retailer: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" },
  Tax: { type: Number }, // Tax percentage
  Category: { type: String }, // e.g., "Hair Care"
  Tags: [{ type: String }], // e.g., ["dandruff", "hair oil", "anti-dandruff"]
  Description: { type: String }, // Brief product description
  Location: { type: String } // Store location or online availability
});

export default mongoose.model('Product', ProductSchema);
