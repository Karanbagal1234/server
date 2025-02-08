import express from 'express';
import {userAuth} from '../helper/Auth.js'


import wrapper from '../helper/wrapper.js';
import { getCartHistory, getPurchasesHistory, removeFromCart, updateCart } from '../controller/cart.js';
const router = express.Router();

router.delete("/remove", userAuth, wrapper(removeFromCart));


router.post("/update-cart", userAuth, wrapper( updateCart));

router.get('/recent/purchases',userAuth, wrapper(getPurchasesHistory));

router.get('/user/cart-history/:userId',userAuth, wrapper(getCartHistory));
export default router