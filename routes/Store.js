import express from "express";
import { userAuth } from "../helper/Auth.js";
import wrapper from "../helper/wrapper.js";
import { endSession, storeDetails, storeScan } from "../controller/store.js";

const router = express.Router();

router.post("/scan", userAuth, wrapper(storeScan));
router.post("/end-session", userAuth, wrapper(endSession));
router.post("/get-store-detail", userAuth, wrapper(storeDetails));
export default router;
