import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  PhoneNumber: { type: String, required: false },
  Address: { type: String, required: false },
  Role: { type: String, enum: ['customer', 'Admin'], default: 'customer' },
  cartHistory: [
    {
      cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' }, // Reference to past carts
      sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreSession' }, // Reference to the session
      storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' }, // Reference to the store
      endedAt: { type: Date }, // When the session ended
    },
  ],
}, { timestamps: true });

export default mongoose.model('User', UserSchema);