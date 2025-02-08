import express from "express";
import { retailerAuth, userAuth } from "../helper/Auth.js";
import { validateInput } from "../helper/SchemaValidator.js";
import {
  retailerLoginSchema,
  retailerRegisterSchema,
  updateProfileSchema,
  userLoginSchema,
  userRegisterSchema,
} from "../helper/JoiSchemas.js";
import wrapper from "../helper/wrapper.js";
import {
  retailerProfile,
  retailLogin,
  retailLogout,
  retailRegister,
  updateProfile,
  userLogin,
  userLogout,
  userProfile,
  userRegister,
} from "../controller/userController.js";

const router = express.Router();

router.post(
  "/user/register",
  validateInput(userRegisterSchema),
  wrapper(userRegister)
);

router.post(
  "/retailer/register",
  validateInput(retailerRegisterSchema),
  wrapper(retailRegister)
);

router.post("/user/login", validateInput(userLoginSchema), wrapper(userLogin));

router.post(
  "/retailer/login",
  validateInput(retailerLoginSchema),
  wrapper(retailLogin)
);
router.post("/user/logout", userLogout);

router.post("/retailer/logout", retailLogout);

router.get("/user/profile", userAuth, userProfile);

router.get("/retailer/profile", retailerAuth, retailerProfile);
router.get("/user/profile", userAuth, validateInput(updateProfileSchema),wrapper(
  updateProfile
));
export default router;
