import express from 'express';
import { generateReceiptData } from '../controller/DigitalRecipt.js';
import { userAuth } from '../helper/Auth.js';
const router = express.Router();

router.post("/generate",userAuth,generateReceiptData)


export default router