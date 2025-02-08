import mongoose from "mongoose";


const RetailerSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
      
    },
    Store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store", // Reference to the Store model
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Retailer", RetailerSchema);