import User from "../models/User.js";
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
    return res.status(403).json({
      error: "No active store session. Please scan the store QR code first.",
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
  ) {
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
};

export const createProduct = async (req, res) => {
  const { Name, Price, Quantity ,Location ,Tax} = req.body;
  const Retailer = req.retailer._id;

  let product = new Product({ Name, Price, Retailer, Quantity ,Location,Tax});
  product = await product.save();

  res.status(201).json({
    _id: product._id.toString(),
    Name: product.Name,
    Price: product.Price,
    Quantity: product.Quantity,
    Tax: product.Tax,
  });
};

export const removeProduct = async (req, res) => {
  try {
    const productId = req.body.id;
    const retailerId = req.retailer._id;

    const product = await Product.findOneAndDelete({ _id: productId, Retailer: retailerId });

    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    // Validate quantity
    if (quantity === undefined) {
      return res.status(400).json({ error: "Quantity is required" });
    }

    // Fetch product and user in parallel
    const [product, user, activeSession] = await Promise.all([
      Product.findById(productId),
      User.findById(userId),
      StoreSession.findOne({ userId, endedAt: null }) // Get active store session
    ]);

    if (!product) return res.status(404).json({ error: "Product not found" });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!activeSession) {
      return res.status(400).json({ error: "No active store session found. Scan store QR code first." });
    }

    // ✅ Find or create a cart linked to the active store session
    let cart = await Cart.findOne({ userId, sessionId: activeSession._id });

    if (!cart) {
      cart = new Cart({ userId, sessionId: activeSession._id, items: [], total: 0 });
      console.log("🔹 New cart created for session:", activeSession._id);
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

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getProducts = async (req, res) => {
  try {
    if (!req.body.cartId)
      return res.status(400).json({ error: "Cart ID is required" });

    const cart = await Cart.findById(req.body.cartId)
      .populate("items.productId")
      .exec();
    if (!cart || !cart.items.length) return res.json([]);

    // Transform data to required format
    const formattedData = cart.items.map((item) => ({
      _id: item.productId?._id?.toString() || "",
      Name: item.productId?.Name || "Unknown",
      Price: item.productId?.Price || 0,
      Quantity: item.quantity || 1,
      Tax: item.productId?.Tax || 0,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
