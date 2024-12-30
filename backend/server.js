import mongoose from "mongoose";
import express from "express";
import organizationRoute from "./routes/organizationRoute.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();



const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api", organizationRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
