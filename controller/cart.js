import User from '../models/User.Model.js';
import Cart from '../models/Cart.js';
import calculateCartTotal from '../helper/calculate.js';
import mongoose from 'mongoose';
import ProductsModel from '../models/Products.model.js';
import createError from '../helper/Error.js';
import StoreSession from '../models/Store.Session.js';
export const removeFromCart = async (req, res) => {

    const { productId } = req.body;
    const userId = req.user._id;

    // Convert to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      createError(404, 'Cart not found');
      // return res.status(404).json({ error: "Cart not found" });
    }

    // Find item index
    const itemIndex = cart.items.findIndex(item => 
      item.productId.equals(productObjectId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not in cart" });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);

    // Recalculate total
    cart.total = await calculateCartTotal(cart.items);
    await cart.save();

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        total: cart.total,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    });

}

export const updateCart = async (req, res) => {

    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validate input
    if (typeof quantity !== 'number' || quantity === 0) {
      return res.status(400).json({ error: "Invalid quantity value" });
    }

    // Convert to ObjectId
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Check product existence
    const product = await ProductsModel.findById(productObjectId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId }) || 
               new Cart({ userId, items: [], total: 0 });

    // Find existing item index
    const itemIndex = cart.items.findIndex(item => 
      item.productId.equals(productObjectId)
    );

    // Handle quantity updates
    if (itemIndex > -1) {
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      
      if (newQuantity < 1) {
        // Remove item if quantity becomes zero or negative
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity with bounds check
        cart.items[itemIndex].quantity = Math.min(newQuantity, 100); // Max 100 items
      }
    } else if (quantity > 0) {
      // Add new item with initial quantity validation
      cart.items.push({
        productId: productObjectId,
        quantity: Math.min(quantity, 100) // Max 100 initially
      });
    }

    // Calculate total using helper
    cart.total = await calculateCartTotal(cart.items);
    
    // Validate cart before saving
    if (cart.total < 0) {
      return res.status(400).json({ error: "Invalid cart total" });
    }

    await cart.save();

    res.json({
      success: true,
      cart: {
        _id: cart._id,
        total: cart.total,
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    });

}

export const getCartHistory = async (req, res) => {
  
    const { userId } = req.user;

    // Find the user and populate cart history
    const user = await User.findById(userId).populate({
      path: 'cartHistory.cartId',
      populate: { path: 'items.productId', model: 'Product' },
    });
    console.log('h');
    
console.log(user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      cartHistory: user.cartHistory,
    });

}


export const getPurchasesHistory = async (req, res) => {
  
  const userId  = req.user._id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
}

const sessions = await StoreSession.find({ userId })
    .populate("storeId", "StoreName")
    .populate("cartId", "amount items status")
    .sort({ createdAt: -1 });

const result = sessions.map(session => ({
    Date: session.createdAt,
    Store: session.storeId?.StoreName || "Unknown",
    Amount: session.cartId?.amount || 0,
    Items: session.cartId?.items || [],
    Status: session.cartId?.status || "Pending"
}));

res.status(200).json(result);

}

