import express from "express";
import OpenAI from "openai";
import Product from "../models/Products.model.jsrs";
import Retailer from "../models/Retailer.js";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chatbot", async (req, res) => {
  try {
    const { message, storeId } = req.body;

    if (!message || !storeId) {
      return res.status(400).json({ error: "Message and Store ID are required" });
    }

    // Step 1: Find the retailer who owns the store
    const retailer = await Retailer.findOne({ Store: storeId }).populate("Store");

    if (!retailer) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Step 2: Extract intent and keywords from OpenAI
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: message }],
    });

    const keywords = chatResponse.choices[0].message.content
      .toLowerCase()
      .split(" ");

    // Step 3: Search for matching products from this specific store
    let products = await Product.find({
      Retailer: retailer._id,
      $or: [
        { Name: { $regex: keywords.join("|"), $options: "i" } },
        { Tags: { $in: keywords } },
        { Category: { $regex: keywords.join("|"), $options: "i" } },
      ],
    }).sort({ Price: 1 });

    // Step 4: Suggest alternatives if no exact match
    if (products.length === 0) {
      products = await Product.find({ Retailer: retailer._id, Category: "Hair Care" }).limit(3);
    }

    // Step 5: Format response
    if (products.length > 0) {
      const response = products.map((p) => ({
        name: p.Name,
        price: p.Price,
        location: retailer.Store.StoreAddress,
      }));
      return res.json({ store: retailer.Store.StoreName, products: response });
    } else {
      return res.json({
        message: `We don’t have that product, but check our Hair Care section at ${retailer.Store.StoreName}!`,
      });
    }
  } catch (error) {
    console.error("Chatbot Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
