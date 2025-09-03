import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import flightRoutes from "./routes/flightRoutes.js";
import contactRoutes from "./routes/contactRoute.js";

const PORT=process.env.PORT

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://cywav.vercel.app",  // Production domain
    "http://localhost:5173",     // Vite dev server
    "http://localhost:3000",     // Alternative dev port
    "http://127.0.0.1:5173"      // Alternative localhost format
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/flights", flightRoutes);
app.use("/api/contact", contactRoutes);



// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT || 5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch(err => console.error("❌ MongoDB Error:", err));
