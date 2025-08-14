import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import ListingRoutes from "./routes/ListingRoutes/ListingRoutes.js";
import ReviewRoutes from "./reviews/reviewroutes/ReviewRoutes.js";
import OrderRoutes from "./orders/orderroutes/OrderRoutes.js";
import AdminRoutes from "./admin/adminroutes/AdminRoutes.js";
import OfferRoutes from "./offers/offerRoutes/OfferRoutes.js";
import ContactRoutes from "./contact/contactRoutes/ContactRoutes.js";
// import ContactRoutes from "./contact/contactRoutes/ContactRoutes.js"

dotenv.config();
const app = express();

// ✅ CORS fix
app.use(cors({
  origin: ["https://perfumes-frontend-one.vercel.app", "http://localhost:5173"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Payload size fix
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const PORT = process.env.PORT || 16000;
const MONGO_URI = process.env.URL_MONGODB;

app.get("/", (req, res) => {
  res.send("Welcome to perfumes backend");
});

// DB connect
const DB_CONNECTION = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.log("DB not connected", error);
  }
};
DB_CONNECTION();

// Routes
app.use("/Listing", ListingRoutes);
app.use("/Reviews", ReviewRoutes);
app.use("/Orders", OrderRoutes);
app.use("/Offer", OfferRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/contact", ContactRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
