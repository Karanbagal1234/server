import express from "express";
import { retailerAuth, userAuth } from "../helper/Auth.js";

const router = express.Router();

import wrapper from "../helper/wrapper.js";
import { addToCart, createProduct, getProducts, productScan } from "../controller/product.js";
import { getProductsForRetailer } from "../controller/userController.js";

router.post("/scan", userAuth, wrapper(productScan));

router.post("/create-product", retailerAuth, wrapper( createProduct));

router.post("/addToCart", userAuth, wrapper(addToCart));
router.get("/getProductDetails", retailerAuth,wrapper(getProductsForRetailer));
router.post("/getProducts", userAuth,wrapper(getProducts));

export default router;
