import mongoose from "mongoose";

const StoreSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Link to the cart
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  }, { timestamps: true });
  
  export default mongoose.model('StoreSession', StoreSessionSchema);