import RetailerModel from "../models/Retailer.Model.js";
import UserModel from "../models/User.Model.js";

export const userAuth = async (req, res, next) => {
  const userId = req.cookies.userId;
  console.log("Cookie userId:", userId);

  if (!userId) {
    console.log("No userId found in cookies" + userId);
    return res
      .status(401)
      .json({
        error: "Unauthorized",
        cookies: userId,
        message: "No userId found in cookies",
      });
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    console.log("User not found in database");
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
};
export const retailerAuth = async (req, res, next) => {

  const retailerId = req.cookies.retailerId;
  if (!retailerId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const retailer = await RetailerModel.findById(retailerId).populate("Store");

  if (!retailer) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.retailer = retailer;
  next();
};
