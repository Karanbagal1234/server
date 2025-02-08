import app from "./index.js";
import connectDB from "./DB/connect.js";
import dotenv from "dotenv";
import os from "os";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Get local IP address
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "127.0.0.1"; // Fallback to localhost
};

// Start server
const server = app.listen(PORT, "0.0.0.0", async () => {
  try {
    await connectDB();
    console.log(`✅ Server running at: http://${getLocalIPAddress()}:${PORT}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received: closing server gracefully.");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received: closing server.");
  server.close(() => {
    console.log("Server shut down.");
    process.exit(0);
  });
});
