import User from "../models/User.Model.js";
import StoreSession from "../models/Store.Session.js";
import QRCode from "qrcode";
import Product from "../models/Products.model.js";
import Cart from "../models/Cart.js";

export const productScan = async (req, res) => {

    const { productId } = req.body;
    const userId = req.user._id;
    // Check if the user has an active session
    const activeSession = await StoreSession.findOne({
      userId,
      endedAt: null, // Session is still active
    });

    

    if (!activeSession) {
      return res
        .status(403)
        .json({
          error:
            "No active store session. Please scan the store QR code first.",
        });
    }

   // Fetch the product details and populate the retailer field
const product = await Product.findById(productId).populate("Retailer");

if (!product) {
  return res.status(404).json({ error: "Product not found" });
}


// Ensure product.Retailer is populated
if (
  !product.Retailer || 
  !product.Retailer.Store.equals(activeSession.storeId) // Compare Store IDs!
){
  return res
    .status(403)
    .json({ error: "This product does not belong to the current store." });
}

    // Return the product details
    res.json({
      success: true,
      product: {
        _id: product._id,
        Name: product.Name,
        Price: product.Price,
        Retailer: product.Retailer,
      },
    });

}

export const createProduct = async (req, res) => {
  
      const { Name, Price, Quantity } = req.body;
      const Retailer = req.retailer._id;

      let product = new Product({ Name, Price, Retailer, Quantity });
      product = await product.save();

      res.status(201).json({
          _id: product._id.toString(),
          Name: product.Name,
          Price: product.Price,
          Quantity: product.Quantity
      });

 
};


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    console.log("Request Body:", req.body);

    // Validate quantity
    if (quantity === undefined) {
      return res.status(400).json({ error: "Quantity is required" });
    }

    // Fetch product and user in parallel
    const [product, user] = await Promise.all([
      Product.findById(productId),
      User.findById(userId),
    ]);

    console.log("Product Found:", product);
    console.log("User Found:", user);

    if (!product) return res.status(404).json({ error: "Product not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    console.log("Cart Found Before Update:", cart);

    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 });
    }

    // Find existing item in cart
    const existingItem = cart.items.find((item) => item.productId.toString() === productId.toString());

    if (existingItem) {
      existingItem.quantity += quantity;
      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId.toString());
      }
    } else {
      if (quantity > 0) {
        cart.items.push({ productId, quantity });
      }
    }

    // Recalculate total
    let total = 0;
    for (const item of cart.items) {
      const productData = await Product.findById(item.productId);
      total += productData ? productData.Price * item.quantity : 0;
    }
    cart.total = total;

   const d = await cart.save();
  //  d.save();
    console.log("Cart Updated Successfully:", cart);

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    console.log("-------------------------------------------------")
    if (!req.body.cartId) return res.status(400).json({ error: "Cart ID is required" });
    console.log("-------------------------------------------------")

    const cart = await Cart.findById(req.body.cartId)
      .populate('items.productId')
      .exec();
      console.log("-------------------------------------------------")

    if (!cart || !cart.items.length) return res.json([]);
    console.log("-------------------------------------------------")

    // Transform data to required format
    const formattedData = cart.items.map((item) => ({
      _id: item.productId?._id?.toString() || "",
      Name: item.productId?.Name || "Unknown",
      Price: item.productId?.Price || 0,
      Quantity: item.quantity || 1,
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
