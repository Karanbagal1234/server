import { faker } from "@faker-js/faker";
import Cart from "../models/Cart.js"; // Import Cart model
import UserModel from "../models/User.js";

import Store from "../models/Store.model.js"; // Import Store model

// Function to generate a transaction ID
const generateTransactionId = () => {
  return `TX${"ekrjhf".split("-")[0].toUpperCase()}`;
};

// Controller to generate receipt data
export const generateReceiptData = async (req, res) => {
  const { cartId, storeId } = req.body;
  const userId = req.user._id;
  try {
    // Fetch the user's cart
    const cart = await Cart.findById(cartId).populate("items.productId");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Fetch the user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Fetch the store details
    const store = await Store.findById({ _id: storeId });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Generate transaction details
    const transactionDetails = {
      transactionId: generateTransactionId(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    // Prepare purchased items
    const purchasedItems = cart.items.map((item) => ({
      id: item.productId._id,
      Name: item.productId.Name || faker.commerce.productName(), // Use product name or generate a fake one
      Quantity: item.Quantity,
      Price: item.productId.Price || faker.commerce.price(), // Use product price or generate a fake one
    }));

    // Prepare store details
    const storeDetails = {
      name: store.StoreName,
      address: store.StoreAddress,
      phone: store.PhoneNumber,
      email: faker.internet.email(), // Generate a fake email for the store
    };

    // Response data
    const receiptData = {
      storeDetails,
      transactionDetails,
      purchasedItems,
      total: cart.total,
    };

    res.status(200).json(receiptData);
  } catch (error) {
    console.error("Error generating receipt data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
