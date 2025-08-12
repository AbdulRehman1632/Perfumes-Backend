import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: ["https://perfumes-frontend-one.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

mongoose.connect(process.env.URL_MONGODB)
  .then(() => console.log("DB connected"))
  .catch(err => console.log("DB not connected", err));

app.get("/", (req, res) => {
  res.send("Welcome to perfumes backend");
});

// routes...
import ListingRoutes from "../../routes/ListingRoutes/ListingRoutes.js";
app.use("/Listing", ListingRoutes);

export default app;
