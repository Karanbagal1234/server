import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreSession', required: true }, // Link to the session
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
      },
    ],
    total: { type: Number, default: 0 },
    status:{
      type:String,
      default:'unpaid',
      enum:['unpaid','paid']
    }
  }, { timestamps: true });
  
  export default mongoose.model('Cart', CartSchema);