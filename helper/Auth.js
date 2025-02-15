import RetailerModel from "../models/Retailer.Model.js";
import UserModel from "../models/User.js";

export const userAuth = async (req, res, next) => {
  const userId = req.body.userId || req.cookies.userId;
  console.log("User ID from request:", userId);

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No userId found in request body or cookies",
    });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const retailerAuth = async (req, res, next) => {
  const retailerId = req.body.retailerId || req.cookies.retailerId;
  console.log("Retailer ID from request:", retailerId);

  if (!retailerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const retailer = await RetailerModel.findById(retailerId).populate("Store");
    if (!retailer) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.retailer = retailer;
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
