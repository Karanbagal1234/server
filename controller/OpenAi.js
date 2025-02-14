import OpenAI from "openai";
import Product from "../models/Product.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getProductRecommendation = async (query) => {
  try {
    // Step 1: Extract intent and keywords from OpenAI
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: query }],
    });

    const keywords = chatResponse.choices[0].message.content
      .toLowerCase()
      .split(" ");

    // Step 2: Find products in the database
    let products = await Product.find({
      $or: [
        { Name: { $regex: keywords.join("|"), $options: "i" } },
        { Tags: { $in: keywords } },
        { Category: { $regex: keywords.join("|"), $options: "i" } },
      ],
    }).sort({ Price: 1 }); // Sorting by price (ascending)

    // Step 3: Suggest alternatives if no exact match
    if (products.length === 0) {
      products = await Product.find({ Category: "Hair Care" }).limit(3);
    }

    // Step 4: Format and return the response
    return products.length > 0
      ? products.map((p) => ({
          name: p.Name,
          price: p.Price,
          location: p.Location,
        }))
      : "Sorry, we don't have the exact product, but check our hair care section!";
  } catch (error) {
    console.error("Error fetching product:", error);
    return "There was an issue fetching the product details.";
  }
};

export default getProductRecommendation;
