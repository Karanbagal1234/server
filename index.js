import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import Eh from "./helper/ErrorHandle.js";
import connectDB from "./DB/connect.js";

import UserRouter from "./routes/Authentication.js";
import ProductRouter from "./routes/product.js";
import StoreRouter from "./routes/Store.js";
import CartRouter from "./routes/cart.js";
import DigitalReceipt from "./routes/recipt.js";
dotenv.config();

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(compression()); // Compress responses

// Rate Limiting (50 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api", limiter);


// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins dynamically
  },
  credentials: true, // Allow credentials
};
app.use(cors(corsOptions));

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("cartId :"+req.body.cartId)
  next();
});

// Routes
app.use("/api/v1/auth", UserRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/store", StoreRouter);
app.use("/api/v1/cart", CartRouter);
app.use("/api/v1/receipt",DigitalReceipt)
// app.use("/api/v1/openAi",ChatBot)
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// Method Not Allowed Middleware
app.use((req, res, next) => {
  if (req.route) {
    return res.status(405).json({ error: `Method ${req.method} not allowed for ${req.originalUrl}` });
  }
  next();
});


// Route Not Found Middleware
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(Eh);

export default app;
